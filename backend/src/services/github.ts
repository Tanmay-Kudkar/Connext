import { env } from "../env.js";

// ─── Config ───────────────────────────────────────────────────────────────────
// GitHub repo used as the "database"
export const GH_DATA_OWNER = env.GITHUB_DATA_OWNER || "Tanmay-Kudkar";
export const GH_DATA_REPO  = env.GITHUB_DATA_REPO  || "Connext-Community";

const GH_API     = "https://api.github.com";
const GH_GRAPHQL = "https://api.github.com/graphql";

// ─── Header helpers ───────────────────────────────────────────────────────────

export function ghHeaders(userToken?: string, accept = "application/vnd.github+json") {
  const token = userToken || env.GITHUB_TOKEN;
  const h: Record<string, string> = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

async function ghFetch(path: string, opts: RequestInit = {}, userToken?: string) {
  const res = await fetch(`${GH_API}${path}`, {
    ...opts,
    headers: { ...ghHeaders(userToken), ...(opts.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`GitHub API ${res.status}: ${err}`);
  }
  return res.json();
}

async function ghGraphql(query: string, variables: Record<string, any> = {}, userToken?: string) {
  const res = await fetch(GH_GRAPHQL, {
    method: "POST",
    headers: ghHeaders(userToken, "application/json"),
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL error: ${res.status}`);
  const json = await res.json() as any;
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

// ─── OAuth ────────────────────────────────────────────────────────────────────

export function getOAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: env.GITHUB_CALLBACK_URL,
    scope: "read:user user:email",
    state,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id:     env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await res.json() as any;
  if (data.error) throw new Error(data.error_description ?? data.error);
  return data.access_token as string;
}

export async function getGitHubUser(accessToken: string) {
  const user = await ghFetch("/user", {}, accessToken) as any;
  const emailsRes = await fetch(`${GH_API}/user/emails`, {
    headers: ghHeaders(accessToken),
  });
  const emails = emailsRes.ok ? await emailsRes.json() as any[] : [];
  const primary = emails.find((e: any) => e.primary)?.email ?? user.email ?? null;
  return { ...user, primaryEmail: primary };
}

// ─── Issues → Questions ────────────────────────────────────────────────────────

export async function listIssues(opts: {
  label?: string;
  state?: "open" | "closed" | "all";
  page?: number;
  per_page?: number;
} = {}) {
  const params = new URLSearchParams({
    state: opts.state ?? "open",
    sort: "updated",
    direction: "desc",
    per_page: String(opts.per_page ?? 20),
    page: String(opts.page ?? 1),
  });
  if (opts.label) params.set("labels", opts.label);

  const issues = await ghFetch(
    `/repos/${GH_DATA_OWNER}/${GH_DATA_REPO}/issues?${params}`
  ) as any[];

  return issues
    .filter((i) => !i.pull_request)
    .map(mapIssue);
}

export async function getIssue(number: number) {
  const issue   = await ghFetch(`/repos/${GH_DATA_OWNER}/${GH_DATA_REPO}/issues/${number}`);
  const comments = await ghFetch(
    `/repos/${GH_DATA_OWNER}/${GH_DATA_REPO}/issues/${number}/comments?per_page=50`
  ) as any[];
  const reactions = await ghFetch(
    `/repos/${GH_DATA_OWNER}/${GH_DATA_REPO}/issues/${number}/reactions`,
    { headers: { Accept: "application/vnd.github+json" } }
  ).catch(() => []) as any[];

  return {
    ...mapIssue(issue),
    comments: comments.map(mapComment),
    reactions: countReactions(reactions),
  };
}

export async function createIssue(
  title: string,
  body: string,
  labels: string[],
  userToken: string
) {
  return ghFetch(
    `/repos/${GH_DATA_OWNER}/${GH_DATA_REPO}/issues`,
    { method: "POST", body: JSON.stringify({ title, body, labels }) },
    userToken
  ).then(mapIssue);
}

export async function addIssueComment(number: number, body: string, userToken: string) {
  const res = await ghFetch(
    `/repos/${GH_DATA_OWNER}/${GH_DATA_REPO}/issues/${number}/comments`,
    { method: "POST", body: JSON.stringify({ body }) },
    userToken
  );
  return mapComment(res);
}

export async function reactToIssue(
  number: number,
  content: "+1" | "-1" | "heart" | "hooray" | "confused" | "rocket" | "eyes",
  userToken: string
) {
  return ghFetch(
    `/repos/${GH_DATA_OWNER}/${GH_DATA_REPO}/issues/${number}/reactions`,
    { method: "POST", body: JSON.stringify({ content }) },
    userToken
  );
}

// ─── Labels → Categories ───────────────────────────────────────────────────────

export async function listLabels() {
  return ghFetch(`/repos/${GH_DATA_OWNER}/${GH_DATA_REPO}/labels?per_page=50`) as Promise<any[]>;
}

// ─── Discussions → Community ──────────────────────────────────────────────────

export async function listDiscussions(categoryId?: string) {
  if (!env.GITHUB_TOKEN) return [];
  const data = await ghGraphql(`
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        discussions(first: 20, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            number title body url createdAt updatedAt upvoteCount
            comments { totalCount }
            category { id name emoji }
            author { login avatarUrl }
            answer { body author { login } }
          }
        }
      }
    }
  `, { owner: GH_DATA_OWNER, repo: GH_DATA_REPO });

  return data.repository.discussions.nodes.map((d: any) => ({
    number:     d.number,
    title:      d.title,
    body:       d.body?.slice(0, 600) ?? null,
    url:        d.url,
    created_at: d.createdAt,
    updated_at: d.updatedAt,
    upvotes:    d.upvoteCount,
    comments:   d.comments.totalCount,
    category:   d.category,
    answered:   !!d.answer,
    author:     { login: d.author?.login, avatar_url: d.author?.avatarUrl },
  }));
}

// ─── Repo meta ────────────────────────────────────────────────────────────────

export async function fetchRepoStats() {
  const repo = await ghFetch(`/repos/${GH_DATA_OWNER}/${GH_DATA_REPO}`).catch(() => null);
  return repo ? {
    stars:       repo.stargazers_count,
    forks:       repo.forks_count,
    open_issues: repo.open_issues_count,
    watchers:    repo.watchers_count,
    description: repo.description,
    html_url:    repo.html_url,
  } : null;
}

// ─── Mapper helpers ───────────────────────────────────────────────────────────

function mapIssue(i: any) {
  return {
    id:         i.id,
    number:     i.number,
    title:      i.title,
    body:       i.body?.slice(0, 1000) ?? null,
    state:      i.state,
    html_url:   i.html_url,
    labels:     (i.labels as any[]).map((l) => ({ name: l.name, color: l.color })),
    author:     { login: i.user?.login, avatar_url: i.user?.avatar_url, html_url: i.user?.html_url },
    comments:   i.comments,
    created_at: i.created_at,
    updated_at: i.updated_at,
  };
}

function mapComment(c: any) {
  return {
    id:         c.id,
    body:       c.body,
    author:     { login: c.user?.login, avatar_url: c.user?.avatar_url },
    created_at: c.created_at,
    html_url:   c.html_url,
  };
}

function countReactions(reactions: any[]) {
  const counts: Record<string, number> = {};
  for (const r of reactions) {
    counts[r.content] = (counts[r.content] ?? 0) + 1;
  }
  return counts;
}
