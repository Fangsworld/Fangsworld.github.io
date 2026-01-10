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
  { href: '/reading', label: '阅读', key: 'reading' },
  { href: '/writing', label: '写作', key: 'writing' },
  { href: '/logic', label: '逻辑', key: 'logic' },
  { href: '/speech', label: '言语', key: 'speech' },
  { href: '/projects', label: '项目', key: 'projects' },
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
