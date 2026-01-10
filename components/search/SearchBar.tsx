'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { ArticleMetadata } from '@/types/article';
import Link from 'next/link';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = '搜索文章...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ArticleMetadata[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [allArticles, setAllArticles] = useState<ArticleMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 加载所有文章（只在客户端执行一次）
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/search/')
      .then(res => res.json())
      .then(data => {
        setAllArticles(data.articles || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load articles:', err);
        setIsLoading(false);
      });
  }, []);

  // 执行搜索 - 使用防抖优化
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // 防抖：延迟搜索执行
    const timer = setTimeout(() => {
      const searchQuery = query.toLowerCase().trim();
      const filtered = allArticles.filter(article => {
        const titleMatch = article.title.toLowerCase().includes(searchQuery);
        const excerptMatch = article.excerpt.toLowerCase().includes(searchQuery);
        const tagsMatch = article.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery)
        );
        const categoryMatch = article.category.toLowerCase().includes(searchQuery);

        return titleMatch || excerptMatch || tagsMatch || categoryMatch;
      });

      setResults(filtered.slice(0, 8)); // 限制最多显示8条结果
    }, 200); // 200ms 防抖

    return () => clearTimeout(timer);
  }, [query, allArticles]);

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // ESC 键关闭搜索结果
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleResultClick = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  const hasQuery = query.trim().length > 0;
  const showResults = isOpen && (hasQuery || results.length > 0);

  return (
    <div className="search-container" ref={searchContainerRef}>
      <div className={`search-bar ${isOpen ? 'open' : ''}`}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="search-input"
            aria-label="搜索文章"
            aria-expanded={isOpen}
            aria-controls="search-results-list"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={handleClear}
              className="search-clear"
              aria-label="清除搜索"
              type="button"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 搜索结果下拉框 */}
        {showResults && (
          <div
            className="search-results"
            id="search-results-list"
            role="listbox"
          >
            {isLoading ? (
              <div className="search-results-empty">
                加载中...
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="search-results-header">
                  找到 {results.length} 篇文章
                </div>
                <div className="search-results-list">
                  {results.map((article, index) => (
                    <Link
                      key={`${article.category}-${article.slug}`}
                      href={`/${article.category}/${article.slug}`}
                      className="search-result-item"
                      onClick={handleResultClick}
                      role="option"
                      tabIndex={index}
                    >
                      <div className="search-result-category">
                        {getCategoryName(article.category)}
                      </div>
                      <div
                        className="search-result-title"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(article.title, query)
                        }}
                      />
                      {article.excerpt && (
                        <div
                          className="search-result-excerpt"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(article.excerpt, query, 80)
                          }}
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </>
            ) : hasQuery ? (
              <div className="search-results-empty">
                没有找到匹配的文章
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

// 高亮匹配的文字
function highlightMatch(text: string, query: string, maxLength?: number): string {
  // HTML 转义防止 XSS
  const escapeHtml = (str: string) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  let displayText = text;

  if (maxLength && text.length > maxLength) {
    displayText = text.substring(0, maxLength) + '...';
  }

  if (!query || !query.trim()) return escapeHtml(displayText);

  // 转义 HTML 和特殊正则字符
  const escapedText = escapeHtml(displayText);
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  try {
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark>$1</mark>');
  } catch {
    // 如果正则表达式无效，返回转义后的文本
    return escapedText;
  }
}

function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    reading: '阅读',
    writing: '写作',
    logic: '逻辑',
    speech: '言语',
    projects: '项目',
  };
  return categoryNames[category] || category;
}
