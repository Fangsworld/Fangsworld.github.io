import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import articleCard from '@/components/articles/ArticleCard.module.css';
import { projectCategories, projects, type Project } from '@/lib/projects';
import styles from './projects.module.css';
import { socialAccounts, socialAccountsUpdatedAt, type SocialAccount } from '@/lib/social-accounts';

const categories = [...projectCategories, '内容传播'];
const categoryCount = (category: string) => category === '内容传播' ? socialAccounts.length : projects.filter(p => p.category === category).length;

export const metadata: Metadata = {
  title: '作品 - 宇文平野',
  description: '宇文平野的个人作品，包括迷宫英语、人生故事、小团圆和一念等应用与工具。',
};

export default function ProjectsPage() {
  return (
    <div className={`container section-page ${styles.collection}`}>
      <div className={styles.collectionBar}>
        <nav className={styles.categoryNav} aria-label="作品分类">
          {categories.map((category, index) => (
            <a href={`#collection-${index}`} key={category}>
              {category}<span>{categoryCount(category)}</span>
            </a>
          ))}
        </nav>
        <span className={styles.workCount}>{projects.length} 件作品</span>
      </div>
      {categories.map((category, index) => (
        <section id={`collection-${index}`} key={category} className={styles.category}>
          <div className={styles.categoryHeading}>
            <h2>{category}</h2>
            <span>{String(categoryCount(category)).padStart(2, '0')}</span>
          </div>
          <div className={`articles-grid ${styles.worksGrid}`}>
            {category === '内容传播'
              ? socialAccounts.map(account => <SocialCard key={account.platform} account={account} />)
              : projects.filter(p => p.category === category).map(project => <ProjectCard key={project.slug} project={project} />)}
          </div>
          {category === '内容传播' && <p className={styles.snapshotNote}>主页资料与粉丝数更新于 {socialAccountsUpdatedAt}</p>}
        </section>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link className={`article-card ${articleCard.root} ${styles.projectCard}`} href={`/projects/${project.slug}`} style={{ '--project-color': project.color } as CSSProperties}>
      <div className={styles.cardHeader}>
        {project.icon && <Image className={styles.appIcon} src={project.icon} width={40} height={40} alt="" />}
        <div className={styles.cardIdentity}>
          <h3 className="article-title">{project.name}</h3>
          <p className={styles.cardSubtitle}>{project.subtitle}</p>
        </div>
      </div>
      <p className="article-excerpt">{project.description}</p>
      <div className={`article-footer ${styles.platformTags}`}>
        {project.platform.split(' / ').map(platform => <span key={platform} className={styles.platform}>{platform}</span>)}
      </div>
    </Link>
  );
}

function SocialCard({ account }: { account: SocialAccount }) {
  return (
    <a className={`article-card ${articleCard.root} ${styles.projectCard}`} href={account.url} target="_blank" rel="noopener noreferrer">
      <div className={styles.cardHeader}>
        <Image className={styles.socialLogo} src={account.logo} width={40} height={40} alt="" />
        <div className={styles.cardIdentity}>
          <h3 className="article-title">{account.name}</h3>
          <p className={styles.cardSubtitle}>{account.platform}</p>
        </div>
      </div>
      <p className="article-excerpt">{account.description}</p>
      <div className="article-footer">
        <span>{account.followers.toLocaleString()} {account.followerLabel ?? '粉丝'}</span>
        <span>访问主页 ↗</span>
      </div>
    </a>
  );
}
