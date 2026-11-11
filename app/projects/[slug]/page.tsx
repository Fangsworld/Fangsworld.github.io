import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { projects } from '@/lib/projects';
import styles from '../projects.module.css';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return { title: `${project.name} - 宇文平野`, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <div className={styles.page}>
      <Link className={styles.backLink} href="/projects">
        <ArrowLeft size={16} aria-hidden="true" /> 返回项目
      </Link>
      <article className={styles.detail}>
        <header className={styles.heading}>
          <p className={styles.label}>{project.platform} · 项目介绍</p>
          <h1>{project.name}</h1>
          <p>{project.overview ?? project.description}</p>
        </header>
        <h2>主要功能</h2>
        <ul>
          {project.features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        {project.publicUrl ? (
          <p className={styles.related}><a href={project.publicUrl}>打开网站</a></p>
        ) : (
          <p className={styles.availability}>暂无公开体验入口。</p>
        )}
        {process.env.NODE_ENV === 'development' && project.localUrl && (
          <p className={styles.localPreview}>
            <a href={project.localUrl}>本机预览</a> · 需先启动本机服务
          </p>
        )}
        {project.links && (
          <div className={styles.related}>
            {project.links.map(({ label, href }) => <Link href={href} key={href}>{label}</Link>)}
          </div>
        )}
      </article>
    </div>
  );
}
