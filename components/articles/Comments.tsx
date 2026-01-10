'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Send, User, Mail, MessageCircle, X, Check, AlertCircle, Loader2, Eye, Heart } from 'lucide-react';

interface Comment {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
  parentId?: number;
}

interface FormData {
  authorName: string;
  authorEmail: string;
  content: string;
}

interface ValidationErrors {
  authorName?: string;
  authorEmail?: string;
  content?: string;
  submit?: string;
}

type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

interface Stats {
  views: number;
  likes: number;
  commentCount: number;
  hasLiked: boolean;
}

interface CommentsProps {
  category: string;
  title: string;
  excerpt?: string;
  initialStats?: Stats;
}

export function Comments({ category, title, excerpt, initialStats }: CommentsProps) {
  const params = useParams();
  const slug = params.slug as string;

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  // 统计数据 - 使用初始值或默认值
  const [stats, setStats] = useState<Stats>(initialStats || {
    views: 0,
    likes: 0,
    commentCount: 0,
    hasLiked: false,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(!initialStats);
  const [isLiking, setIsLiking] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState<FormData>({
    authorName: '',
    authorEmail: '',
    content: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  // 加载统计数据并记录浏览（仅在客户端且没有初始值时）
  useEffect(() => {
    if (!slug || initialStats) return;

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
        setIsLoadingStats(false);
      }
    };

    initStats();
  }, [slug, category, title, excerpt, initialStats]);

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

  // 实时验证
  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'authorName':
        if (!value.trim()) return '请输入您的姓名';
        if (value.length > 100) return '姓名过长';
        return undefined;
      case 'authorEmail':
        if (!value.trim()) return '请输入邮箱地址';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '邮箱格式不正确';
        return undefined;
      case 'content':
        if (!value.trim()) return '请输入评论内容';
        if (value.length > 2000) return '评论内容不能超过2000字';
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 实时验证已触摸的字段
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, formData[name as keyof FormData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [formData, validateField]);

  // 加载评论
  useEffect(() => {
    if (!slug) return;

    const loadComments = async () => {
      try {
        const response = await fetch(`/api/articles/${encodeURIComponent(slug)}/comments`);
        const data = await response.json();
        setComments(data.comments || []);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [slug]);

  // 提交评论
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 标记所有字段为已触摸
    const allTouched = { authorName: true, authorEmail: true, content: true };
    setTouched(allTouched);

    // 验证所有字段
    const newErrors: ValidationErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setFormStatus('submitting');
    setErrors({});

    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(slug)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: replyTo || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus('success');
        setStatusMessage(data.message || '评论提交成功，等待审核后显示');
        setFormData({ authorName: '', authorEmail: '', content: '' });
        setTouched({});
        setReplyTo(null);
        // 更新评论数
        setStats(prev => ({ ...prev, commentCount: prev.commentCount + 1 }));

        // 3秒后关闭表单并清除消息
        setTimeout(() => {
          setShowForm(false);
          setFormStatus('idle');
          setStatusMessage('');
        }, 3000);
      } else {
        setFormStatus('error');
        // API 返回的 error 可能是字符串或对象
        const errorMsg = typeof data.error === 'string' ? data.error : '提交失败，请稍后重试';
        setErrors({ submit: errorMsg });
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
      setFormStatus('error');
      setErrors({ submit: '网络错误，请稍后重试' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setFormData({ authorName: '', authorEmail: '', content: '' });
    setErrors({});
    setTouched({});
    setReplyTo(null);
    setFormStatus('idle');
    setStatusMessage('');
  }, []);

  const startReply = useCallback((commentId: number) => {
    setReplyTo(commentId);
    setShowForm(true);
    setFormStatus('idle');
    // 滚动到表单
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = formRef.current?.querySelector('input');
      firstInput?.focus();
    }, 100);
  }, []);

  return (
    <div className="comments-section">
      {/* 头部：统计 + 写评论按钮 */}
      <div className="comments-header">
        <div className="comments-stats">
          {isLoadingStats ? (
            <>
              <span className="stat-item skeleton"><Eye size={16} /><span>--</span></span>
              <span className="stat-item skeleton"><Heart size={16} /><span>--</span></span>
              <span className="stat-item skeleton"><MessageCircle size={16} /><span>--</span></span>
            </>
          ) : (
            <>
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
              <span className="stat-item" title="评论数">
                <MessageCircle size={16} />
                <span>{stats.commentCount.toLocaleString()}</span>
              </span>
            </>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-write-comment"
          >
            <Send size={14} />
            写评论
          </button>
        )}
      </div>

      {/* 状态消息 */}
      {formStatus === 'success' && statusMessage && (
        <div className="status-message success">
          <Check size={18} />
          {statusMessage}
        </div>
      )}

      {formStatus === 'error' && errors.submit && (
        <div className="status-message error">
          <AlertCircle size={18} />
          {errors.submit}
        </div>
      )}

      {/* 评论表单 */}
      {showForm && (
        <div className="comment-form-wrapper">
          {replyTo && (
            <div className="reply-banner">
              <span>回复评论 #{replyTo}</span>
              <button
                onClick={() => setReplyTo(null)}
                className="btn-cancel-reply"
                aria-label="取消回复"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <form ref={formRef} onSubmit={handleSubmit} className="comment-form">
            <div className="form-row">
              <div className={`form-group ${errors.authorName && touched.authorName ? 'has-error' : ''} ${touched.authorName && !errors.authorName ? 'is-valid' : ''}`}>
                <label htmlFor="authorName">
                  <User size={16} />
                  姓名
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="您的姓名"
                  disabled={formStatus === 'submitting'}
                  autoComplete="name"
                />
                {errors.authorName && touched.authorName && (
                  <span className="error-message">{errors.authorName}</span>
                )}
              </div>

              <div className={`form-group ${errors.authorEmail && touched.authorEmail ? 'has-error' : ''} ${touched.authorEmail && !errors.authorEmail ? 'is-valid' : ''}`}>
                <label htmlFor="authorEmail">
                  <Mail size={16} />
                  邮箱
                  <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="authorEmail"
                  name="authorEmail"
                  value={formData.authorEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your@email.com"
                  disabled={formStatus === 'submitting'}
                  autoComplete="email"
                />
                {errors.authorEmail && touched.authorEmail && (
                  <span className="error-message">{errors.authorEmail}</span>
                )}
              </div>
            </div>

            <div className={`form-group ${errors.content && touched.content ? 'has-error' : ''} ${touched.content && !errors.content ? 'is-valid' : ''}`}>
              <label htmlFor="content">
                评论内容
                <span className="required">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={5}
                value={formData.content}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="分享您的想法..."
                disabled={formStatus === 'submitting'}
                maxLength={2000}
              />
              <div className="form-footer">
                {errors.content && touched.content && (
                  <span className="error-message">{errors.content}</span>
                )}
                <span className={`char-count ${formData.content.length > 1800 ? 'warning' : ''}`}>
                  {formData.content.length}/2000
                </span>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
                disabled={formStatus === 'submitting'}
              >
                取消
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'submitting' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    提交评论
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 评论列表 */}
      <div className="comments-list-container">
        {isLoadingComments ? (
          <div className="comments-skeleton">
            {[1, 2, 3].map(i => (
              <div key={i} className="comment-skeleton-item">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-content">
                  <div className="skeleton-header">
                    <div className="skeleton-name"></div>
                    <div className="skeleton-date"></div>
                  </div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  <User size={20} />
                </div>
                <div className="comment-body">
                  <div className="comment-header">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-date" title={new Date(comment.createdAt).toLocaleString('zh-CN')}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-actions">
                    <button
                      onClick={() => startReply(comment.id)}
                      className="btn-reply"
                      aria-label={`回复 ${comment.authorName}`}
                    >
                      <Send size={14} />
                      回复
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-comments">
            <MessageCircle size={48} strokeWidth={1} />
            <p>暂无评论，快来抢沙发吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 格式化日期显示
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
