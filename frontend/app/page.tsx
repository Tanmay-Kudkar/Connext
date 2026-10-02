import { getMe, serverApi } from "@/lib/server-api";
import { EntryScreen } from "@/components/auth/EntryScreen";
import { HomeFeed } from "@/components/feed/HomeFeed";
import type { FeedPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const me = await getMe();
  if (!me) return <EntryScreen />;

  try {
    const feed = await serverApi<{ posts: FeedPost[] }>("/api/feed");
    return <HomeFeed initialPosts={feed.posts} />;
  } catch (err) {
    return <HomeFeed initialPosts={[]} initialError={err instanceof Error ? err.message : "Could not load the feed"} />;
  }
}
