export type PublicUser = {
  id: string;
  handle: string;
  displayName: string;
  initials: string;
  role: string;
  mode: "vibe" | "pro" | string;
  accent: string;
  avatarPack: string;
  bio: string | null;
  skills: string[];
  interests: string[];
  institution: {
    id: string;
    name: string;
    short: string;
    city: string;
    state: string;
  } | null;
};

export type PublicAuthor =
  | {
      anon: true;
      displayName: "Verified student";
      initials: "?";
      handle: null;
      id: null;
      institution: null;
      role: null;
    }
  | {
      anon: false;
      id: string;
      handle: string;
      displayName: string;
      initials: string;
      role: string;
      institution: { short: string; name: string; city?: string } | null;
    };

export type FeedPost = {
  id: string;
  channelId: string;
  communitySlug?: string;
  channelType?: string;
  title: string;
  body: string;
  status: "open" | "resolved" | string;
  anon: boolean;
  tags: string[];
  createdAt: string;
  upvotes: number;
  commentCount: number;
  credits: number;
  isOwner: boolean;
  author: PublicAuthor;
};

export type Community = {
  id: string;
  slug: string;
  name: string;
  description: string;
  syllabusTag: string | null;
  category: string;
  visibility: string;
  postCount?: number;
  memberCount?: number;
  joined?: boolean;
  channels?: { id: string; type: string; name: string }[];
};

export type ThreadComment = {
  id: string;
  postId: string;
  parentId: string | null;
  path: string;
  depth: number;
  body: string;
  anon: boolean;
  createdAt: string;
  upvotes: number;
  awarded: boolean;
  isOwner: boolean;
  canUnblock: boolean;
  author: PublicAuthor;
  children?: ThreadComment[];
  truncated?: boolean;
};
