import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import articleCard from '@/components/articles/ArticleCard.module.css';
import { projectCategories, projects, type Project } from '@/lib/projects';
import styles from './projects.module.css';

export const metadata: Metadata = {
  title: '作品 - 宇文平野',
  description: '宇文平野的个人作品，包括迷宫英语、人生故事、小团圆和一念等应用与工具。',
};

export default function ProjectsPage() {
  return (
    <div className={`container section-page ${styles.collection}`}>
      <header className={styles.intro}>
        <h1>把想法做成日常可用的工具。</h1>
        <span>{projects.length} 件作品 · 持续打磨中</span>
      </header>
      <nav className={styles.categoryNav} aria-label="作品分类">
        {projectCategories.map((category, index) => (
          <a href={`#collection-${index}`} key={category}>
            {category}<span>{projects.filter(p => p.category === category).length}</span>
          </a>
        ))}
      </nav>
      {projectCategories.map((category, index) => (
        <section id={`collection-${index}`} key={category} className={styles.category}>
          <div className={styles.categoryHeading}>
            <h2>{category}</h2>
            <span>{String(projects.filter(p => p.category === category).length).padStart(2, '0')}</span>
          </div>
          <div className="articles-grid">
            {projects.filter(p => p.category === category).map(project => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link className={`article-card ${articleCard.root} ${styles.projectCard}`} href={`/projects/${project.slug}`} style={{ '--project-color': project.color } as CSSProperties}>
      <div className={`article-meta ${styles.platformTags}`}>
        {project.platform.split(' / ').map(platform => <span key={platform} className={`article-category ${styles.platform}`}>{platform}</span>)}
      </div>
      <div className={styles.cardTitle}>
        {project.icon && <Image className={styles.appIcon} src={project.icon} width={44} height={44} alt="" />}
        <h3 className="article-title">{project.name}</h3>
      </div>
      <p className="article-excerpt">{project.description}</p>
    </Link>
  );
}
