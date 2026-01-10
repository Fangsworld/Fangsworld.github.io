'use client';

import { useEffect, useRef } from 'react';

interface ScrollToTopProps {
  children: React.ReactNode;
}

export function ScrollToTop({ children }: ScrollToTopProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 保存原始的body overflow样式
    const originalOverflow = document.body.style.overflow;

    // 隐藏body滚动条，防止双滚动条
    document.body.style.overflow = 'hidden';

    // 添加文章页面活动标记，用于隐藏footer
    document.body.classList.add('article-page-active');

    // 滚动到顶部
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }

    // 清理函数：恢复body滚动条和移除类
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('article-page-active');
    };
  }, []);

  return (
    <div ref={containerRef} className="article-page-wrapper">
      {children}
    </div>
  );
}
