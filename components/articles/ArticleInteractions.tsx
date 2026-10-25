'use client';

import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Eye } from 'lucide-react';

interface Stats {
  views: number;
  likes: number;
  commentCount: number;
  hasLiked: boolean;
  available?: boolean;
}

const emptyStats: Stats = { views: 0, likes: 0, commentCount: 0, hasLiked: false };
const StatsContext = createContext<{
  stats: Stats;
  setStats: Dispatch<SetStateAction<Stats>>;
  isLoadingStats: boolean;
  available: boolean;
} | null>(null);

// Share an in-flight write across Strict Mode effects and count once per browser
// document. Failed requests are removed so a later navigation can retry.
const viewRequests = new Map<string, Promise<Stats>>();
const recordedViews = new Set<string>();

async function loadStats(slug: string, category: string, title: string, excerpt?: string): Promise<Stats> {
  const key = `${category}/${slug}`;
  const pending = viewRequests.get(key);
  if (pending) return pending;
  const url = `/api/articles/${encodeURIComponent(slug)}/stats`;
  if (recordedViews.has(key)) {
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('统计暂时不可用');
    return response.json();
  }
  const request = (async () => {
    const response = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view', category, title, excerpt }),
    });
    if (response.status === 503) return { ...emptyStats, available: false };
    if (!response.ok) throw new Error('统计暂时不可用');
    const stats: Stats = await response.json();
    recordedViews.add(key);
    return stats;
  })();
  viewRequests.set(key, request);
  try {
    return await request;
  } finally {
    viewRequests.delete(key);
  }
}

export function ArticleInteractions({ slug, category, title, excerpt, children }: {
  slug: string; category: string; title: string; excerpt?: string; children: ReactNode;
}) {
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [isLoadingStats, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    loadStats(slug, category, title, excerpt).then(data => {
      if (!active) return;
      setStats(data);
      setAvailable(data.available !== false);
    }).catch(() => {
      if (active) setAvailable(false);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [slug, category, title, excerpt]);

  return <StatsContext.Provider value={{ stats, setStats, isLoadingStats, available }}>{children}</StatsContext.Provider>;
}

export function useArticleInteractions() {
  const context = useContext(StatsContext);
  if (!context) throw new Error('Article interactions require ArticleInteractions');
  return context;
}

export function ArticleViews() {
  const { stats, isLoadingStats, available } = useArticleInteractions();
  return <span className="article-views"><Eye size={14} strokeWidth={2} /><span>{isLoadingStats || !available ? '—' : stats.views.toLocaleString()}</span></span>;
}
