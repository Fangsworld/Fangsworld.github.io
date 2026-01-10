import { Category } from '@/types/article';

interface CategoryHeaderProps {
  category: Category;
}

const CATEGORY_INFO: Record<Category, { title: string; subtitle: string }> = {
  reading: {
    title: '阅读',
    subtitle: '分享读书心得与知识提炼'
  },
  writing: {
    title: '写作',
    subtitle: '探索文字的力量与表达的艺术'
  },
  logic: {
    title: '逻辑',
    subtitle: '理性思考与逻辑思维的实践'
  },
  speech: {
    title: '言语',
    subtitle: '沟通艺术与语言表达技巧'
  },
  projects: {
    title: '项目',
    subtitle: '实践项目与技术探索成果展示'
  }
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const info = CATEGORY_INFO[category];

  return (
    <div className="section-header">
      <h2 className="section-title">{info.title}</h2>
      <p className="section-subtitle">{info.subtitle}</p>
    </div>
  );
}
