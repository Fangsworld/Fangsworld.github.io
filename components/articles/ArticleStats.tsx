'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

interface ArticleStatsProps {
  category: string;
  title: string;
  excerpt?: string;
  onCommentClick?: () => void;
}

interface Stats {
  views: number;
  likes: number;
  commentCount: number;
  hasLiked: boolean;
}

export function ArticleStats({ category, title, excerpt, onCommentClick }: ArticleStatsProps) {
  const params = useParams();
  const slug = params.slug as string;

  const [stats, setStats] = useState<Stats>({
    views: 0,
    likes: 0,
    commentCount: 0,
    hasLiked: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  // 加载统计数据并记录浏览
  useEffect(() => {
    if (!slug) return;

    const initStats = async () => {
      try {
        // 记录浏览量
        await fetch(`/api/articles/${encodeURIComponent(slug)}/stats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'view',
            category,
            title,
            excerpt,
          }),
        });

        // 获取统计数据
        const response = await fetch(`/api/articles/${encodeURIComponent(slug)}/stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initStats();
  }, [slug, category, title, excerpt]);

  // 点赞功能
  const handleLike = useCallback(async () => {
    if (!slug || isLiking) return;

    setIsLiking(true);
    setShowLikeAnimation(true);

    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(slug)}/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });

      const data = await response.json();
      setStats({
        views: stats.views,
        likes: data.totalLikes,
        commentCount: stats.commentCount,
        hasLiked: data.liked,
      });

      // 动画重置
      setTimeout(() => setShowLikeAnimation(false), 600);
    } catch (error) {
      console.error('Failed to like article:', error);
    } finally {
      setIsLiking(false);
    }
  }, [slug, stats, isLiking]);

  // 点击评论数
  const handleCommentClick = useCallback(() => {
    if (onCommentClick) {
      onCommentClick();
    } else {
      const commentsSection = document.querySelector('.comments-section');
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [onCommentClick]);

  if (isLoading) {
    return (
      <div className="article-stats-bar">
        <div className="article-stats">
          <span className="stat-item skeleton">
            <Eye size={16} className="animate-pulse" />
            <span>--</span>
          </span>
          <span className="stat-item skeleton">
            <Heart size={16} className="animate-pulse" />
            <span>--</span>
          </span>
          <span className="stat-item skeleton">
            <MessageCircle size={16} className="animate-pulse" />
            <span>--</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="article-stats-bar">
      <div className="article-stats">
        <span className="stat-item" title="浏览次数">
          <Eye size={16} />
          <span>{stats.views.toLocaleString()}</span>
        </span>

        <span
          className={`stat-item ${stats.hasLiked ? 'liked' : ''} ${showLikeAnimation ? 'animate' : ''}`}
          onClick={handleLike}
          title={stats.hasLiked ? '取消点赞' : '点赞这篇文章'}
          style={{ cursor: isLiking ? 'wait' : 'pointer' }}
        >
          <Heart
            size={16}
            className={isLiking ? 'animate-spin' : ''}
            fill={stats.hasLiked ? 'currentColor' : 'none'}
          />
          <span>{stats.likes.toLocaleString()}</span>
        </span>

        <span
          className="stat-item clickable"
          onClick={handleCommentClick}
          title="查看评论"
        >
          <MessageCircle size={16} />
          <span>{stats.commentCount.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}
