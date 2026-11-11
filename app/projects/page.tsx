import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { projectCategories, projects, type Project } from '@/lib/projects';
import articleCard from '@/components/articles/ArticleCard.module.css';
import styles from './projects.module.css';

export const metadata: Metadata = {
  title: '项目 - 宇文平野',
  description: '宇文平野的个人项目，包括迷宫英语、人生故事和其他应用原型。',
};

export default function ProjectsPage() {
  return (
    <div className="container section-page">
      <header className="section-header">
        <h1 className="section-subtitle">学习、创作、研究与日常管理的个人开发实践</h1>
      </header>

      {projectCategories.map((category) => (
        <section key={category} className={styles.category}>
          <h2>{category}</h2>
          <div className="articles-grid">
            {projects.filter((project) => project.category === category).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProjectCard({
  project: { slug, name, platform, description, color },
}: {
  project: Project;
}) {
  return (
    <Link
      className={`article-card ${articleCard.root} ${styles.projectCard}`}
      href={`/projects/${slug}`}
      style={{ '--project-color': color } as CSSProperties}
    >
      <div className="article-meta">
        <span className={`article-category ${styles.platform}`}>{platform}</span>
      </div>
      <h3 className="article-title">{name}</h3>
      <p className="article-excerpt">{description}</p>
    </Link>
  );
}
