'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  fallback?: string;
  className?: string;
}

export function BackButton({ fallback = '/', className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 如果有历史记录，返回上一页
    if (window.history.length > 1) {
      router.back();
    } else {
      // 没有历史记录，跳转到 fallback
      router.push(fallback);
    }
  };

  return (
    <a href={fallback} onClick={handleClick} className={`back-button ${className}`}>
      <ArrowLeft size={20} />
      <span>返回</span>
    </a>
  );
}
