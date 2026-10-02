CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS institutions (
  id text PRIMARY KEY,
  name text NOT NULL,
  short text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  domain text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  handle text NOT NULL UNIQUE,
  display_name text NOT NULL,
  initials text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL,
  institution_id text NOT NULL REFERENCES institutions(id),
  mode text NOT NULL DEFAULT 'vibe',
  accent text NOT NULL DEFAULT '#FF4B2B',
  avatar_pack text NOT NULL DEFAULT 'initials',
  verified_at timestamptz,
  bio text,
  skills text[] NOT NULL DEFAULT '{}',
  interests text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS communities (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  syllabus_tag text,
  category text NOT NULL,
  visibility text NOT NULL DEFAULT 'public'
);

CREATE TABLE IF NOT EXISTS channels (
  id text PRIMARY KEY,
  community_id text NOT NULL REFERENCES communities(id),
  type text NOT NULL,
  name text NOT NULL
);

CREATE TABLE IF NOT EXISTS memberships (
  user_id text NOT NULL REFERENCES users(id),
  community_id text NOT NULL REFERENCES communities(id),
  role text NOT NULL DEFAULT 'member',
  PRIMARY KEY (user_id, community_id)
);

CREATE TABLE IF NOT EXISTS posts (
  id text PRIMARY KEY,
  channel_id text NOT NULL REFERENCES channels(id),
  author_id text NOT NULL REFERENCES users(id),
  anon boolean NOT NULL DEFAULT true,
  title text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  syllabus_unit_id text,
  tags text[] NOT NULL DEFAULT '{}',
  embedding vector(768),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_channel_created_idx ON posts (channel_id, created_at);

CREATE TABLE IF NOT EXISTS comments (
  id text PRIMARY KEY,
  post_id text NOT NULL REFERENCES posts(id),
  parent_id text,
  path text NOT NULL,
  author_id text NOT NULL REFERENCES users(id),
  anon boolean NOT NULL DEFAULT false,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_post_path_idx ON comments (post_id, path);

CREATE TABLE IF NOT EXISTS votes (
  user_id text NOT NULL REFERENCES users(id),
  target_type text NOT NULL,
  target_id text NOT NULL,
  value integer NOT NULL,
  PRIMARY KEY (user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS credit_events (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  type text NOT NULL,
  comment_id text NOT NULL REFERENCES comments(id),
  confirmer_id text NOT NULL REFERENCES users(id),
  weight integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS credit_events_comment_type_idx ON credit_events (comment_id, type);
CREATE INDEX IF NOT EXISTS credit_events_user_created_idx ON credit_events (user_id, created_at);

CREATE TABLE IF NOT EXISTS credit_ledger (
  user_id text PRIMARY KEY REFERENCES users(id),
  balance integer NOT NULL DEFAULT 0,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  streak_days integer NOT NULL DEFAULT 0,
  last_active timestamptz
);

CREATE TABLE IF NOT EXISTS quests (
  id text PRIMARY KEY,
  title text NOT NULL,
  target integer NOT NULL,
  xp_reward integer NOT NULL,
  icon text NOT NULL,
  kind text NOT NULL
);

CREATE TABLE IF NOT EXISTS user_quests (
  user_id text NOT NULL REFERENCES users(id),
  quest_id text NOT NULL REFERENCES quests(id),
  progress integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  PRIMARY KEY (user_id, quest_id)
);

CREATE TABLE IF NOT EXISTS badges (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id text NOT NULL REFERENCES users(id),
  badge_id text NOT NULL REFERENCES badges(id),
  earned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id text PRIMARY KEY,
  reporter_id text NOT NULL REFERENCES users(id),
  target_type text NOT NULL,
  target_id text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mock_links (
  user_id text NOT NULL REFERENCES users(id),
  provider text NOT NULL,
  payload jsonb NOT NULL,
  PRIMARY KEY (user_id, provider)
);

CREATE INDEX IF NOT EXISTS posts_embedding_idx ON posts USING hnsw (embedding vector_cosine_ops);
