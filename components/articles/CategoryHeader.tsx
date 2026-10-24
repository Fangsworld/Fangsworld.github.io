import { Category } from '@/types/article';

interface CategoryHeaderProps {
  category: Category;
}

const CATEGORY_INFO: Record<Category, { title: string; subtitle: string }> = {
  ai: {
    title: 'AI',
    subtitle: '人工智能工具、模型与协作实践'
  },
  society: {
    title: '社会',
    subtitle: '社会心理、沟通与人际关系'
  },
  science: {
    title: '科学',
    subtitle: '逻辑、数学与思维方法'
  },
  health: {
    title: '健康',
    subtitle: '身心状态、精力与长期节奏'
  },
  essays: {
    title: '随感',
    subtitle: '阅读、写作与个人思考'
  },
  products: {
    title: '产品',
    subtitle: '项目需求、工具与产品实践'
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
