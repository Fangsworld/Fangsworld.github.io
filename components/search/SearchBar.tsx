'use client';

import styles from './SearchBar.module.css';

import { useState, useEffect, useRef, useCallback, useId, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ArticleMetadata, CATEGORY_NAMES, type Category } from '@/types/article';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  onNavigate?: () => void;
}

export function SearchBar({ placeholder = '搜索文章...', onNavigate }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [allArticles, setAllArticles] = useState<ArticleMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const resultsId = useId();
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 请求随组件卸载取消，开发模式重复执行 effect 时不会更新旧请求的状态。
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/search/', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Search request failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!controller.signal.aborted) setAllArticles(data.articles || []);
      })
      .catch(err => {
        if (controller.signal.aborted) return;
        console.error('Failed to load articles:', err);
        setLoadError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    return allArticles.filter(article =>
      article.title.toLowerCase().includes(debouncedQuery) ||
      article.excerpt.toLowerCase().includes(debouncedQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(debouncedQuery)) ||
      article.category.toLowerCase().includes(debouncedQuery)
    ).slice(0, 8);
  }, [allArticles, debouncedQuery]);

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
    setDebouncedQuery('');
    setActiveIndex(-1);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleResultClick = useCallback(() => {
    onNavigate?.();
    setIsOpen(false);
    setQuery('');
    setDebouncedQuery('');
    setActiveIndex(-1);
  }, [onNavigate]);

  const hasQuery = query.trim().length > 0;
  const showResults = isOpen && hasQuery;
  const isSearching = query.trim().toLowerCase() !== debouncedQuery;
  const selectedIndex = activeIndex < results.length ? activeIndex : -1;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLoading || isSearching || !hasQuery || results.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex(index => index < 0
        ? (step > 0 ? 0 : results.length - 1)
        : (index + step + results.length) % results.length);
    } else if (event.key === 'Enter' && showResults && selectedIndex >= 0) {
      event.preventDefault();
      const article = results[selectedIndex];
      router.push(`/${article.category}/${encodeURIComponent(article.slug)}`);
      handleResultClick();
    }
  };

  return (
    <div className={`search-container ${styles.root}`} ref={searchContainerRef}>
      <div className={`search-bar ${isOpen ? 'open' : ''}`}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
            aria-label="搜索文章"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showResults}
            aria-controls={showResults ? resultsId : undefined}
            aria-activedescendant={showResults && !isSearching && selectedIndex >= 0 ? `${resultsId}-${selectedIndex}` : undefined}
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
            id={resultsId}
            aria-label="文章搜索结果"
            role="listbox"
          >
            {loadError ? (
              <div className="search-results-empty">搜索暂时不可用，请刷新重试。</div>
            ) : isLoading || isSearching ? (
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
                      id={`${resultsId}-${index}`}
                      aria-selected={selectedIndex === index}
                      tabIndex={0}
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
  return CATEGORY_NAMES[category as Category] || category;
}
