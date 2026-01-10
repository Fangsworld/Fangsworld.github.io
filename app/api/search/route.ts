import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/articles';

export async function GET() {
  try {
    const articles = getAllArticles();

    return NextResponse.json({
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
