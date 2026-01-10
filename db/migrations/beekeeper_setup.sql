-- 复制下面的 SQL 到 Beekeeper Studio 中执行

-- 文章统计表
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 点赞表
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category);
CREATE INDEX IF NOT EXISTS articles_views_idx ON articles(views);

CREATE INDEX IF NOT EXISTS comments_article_slug_idx ON comments(article_slug);
CREATE INDEX IF NOT EXISTS comments_status_idx ON comments(status);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at);

CREATE INDEX IF NOT EXISTS likes_article_slug_idx ON likes(article_slug);
CREATE INDEX IF NOT EXISTS likes_unique_idx ON likes(article_slug, ip_address);
