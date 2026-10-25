import fs from 'fs';
import path from 'path';
import { Category } from '@/types/article';

// Metadata/list discovery deliberately does not load the Markdown renderer.
export function getMarkdownFiles(category: Category): string[] {
  const directory = path.join(process.cwd(), 'articles', category);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(file => file.endsWith('.md'));
}
