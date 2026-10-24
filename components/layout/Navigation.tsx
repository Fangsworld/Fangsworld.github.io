'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import styles from './Navigation.module.css';
import { SearchBar } from '@/components/search/SearchBar';

interface NavItem {
  href: string;
  label: string;
  key: string;
}

const navItems: NavItem[] = [
  { href: '/', label: '主页', key: 'home' },
  { href: '/ai', label: 'AI', key: 'ai' },
  { href: '/society', label: '社会', key: 'society' },
  { href: '/science', label: '科学', key: 'science' },
  { href: '/health', label: '健康', key: 'health' },
  { href: '/essays', label: '随感', key: 'essays' },
  { href: '/products', label: '产品', key: 'products' },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="nav-header">
        <div className="container">
          <nav className="nav-content">
            <Link href="/" className="nav-brand">
              <img src="/images/personal-photo.jpg" alt="宇文平野头像" className="brand-avatar" />
              <span className="brand-text">宇文平野</span>
            </Link>

            <div className="nav-menu">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="nav-actions">
              <SearchBar placeholder="搜索..." />
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <SearchBar placeholder="搜索文章..." />
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`mobile-link ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
