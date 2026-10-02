import { getMe, serverApi } from "@/lib/server-api";
import { EntryScreen } from "@/components/auth/EntryScreen";
import { PostRow } from "@/components/feed/PostRow";
import type { FeedPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const me = await getMe();
  if (!me) return <EntryScreen />;

  const feed = await serverApi<{ posts: FeedPost[] }>("/api/feed");

  return (
    <div>
      <header className="mb-2">
        <h1 className="text-title">Home</h1>
        <p className="text-small text-muted">Joined communities, then the rest of campus.</p>
      </header>
      {feed.posts.length === 0 ? (
        <p className="mt-8 text-muted">Nobody has asked yet. Be first. Anonymous is on.</p>
      ) : (
        feed.posts.map((post) => <PostRow key={post.id} post={post} />)
      )}
    </div>
  );
}
