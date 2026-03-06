-- News table for PIKSEL naujienos
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  tag TEXT NOT NULL DEFAULT 'NAUJIENA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow all (admin protected by custom login; public can read)
CREATE POLICY "news_all" ON news FOR ALL USING (true);

COMMENT ON TABLE news IS 'PIKSEL naujienų straipsniai';
