import { Category } from '@/types/article';

interface CategoryHeaderProps {
  category: Category;
}

const CATEGORY_SUBTITLES: Record<Category, string> = {
  ai: '人工智能工具、模型与协作实践',
  society: '社会心理、沟通与人际关系',
  science: '逻辑、数学与思维方法',
  health: '身心状态、精力与长期节奏',
  essays: '社会观察、科学思考、身心健康与个人随笔',
  products: '项目需求、工具与产品实践',
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="section-header">
      <h1 className="section-subtitle">{CATEGORY_SUBTITLES[category]}</h1>
    </div>
  );
}
