import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateArticle, incrementArticleViews, getArticleStats, toggleLike, hasUserLiked } from '@/db/queries';
import { headers } from 'next/headers';
import { isDatabaseEnabled } from '@/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // 检查数据库是否可用
  if (!isDatabaseEnabled) {
    return NextResponse.json({
      views: 0,
      likes: 0,
      commentCount: 0,
      hasLiked: false,
    });
  }

  try {
    const { slug } = await params;
    const stats = await getArticleStats(slug);

    // 检查用户是否已点赞
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const hasLiked = await hasUserLiked(slug, ip);

    return NextResponse.json({
      ...stats,
      hasLiked,
    });
  } catch (error) {
    console.error('Error fetching article stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article stats' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // 检查数据库是否可用
  if (!isDatabaseEnabled) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { action, category, title, excerpt } = body;

    // 获取 IP 地址
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || undefined;

    if (action === 'view') {
      // 增加浏览量
      await getOrCreateArticle(slug, category || 'reading', title || '', excerpt);
      await incrementArticleViews(slug);
      const stats = await getArticleStats(slug);
      return NextResponse.json(stats);
    } else if (action === 'like') {
      // 切换点赞
      const result = await toggleLike(slug, ip, userAgent);
      return NextResponse.json(result);
    } else if (action === 'init') {
      // 初始化文章记录
      const article = await getOrCreateArticle(slug, category, title, excerpt);
      return NextResponse.json(article);
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating article stats:', error);
    return NextResponse.json(
      { error: 'Failed to update article stats' },
      { status: 500 }
    );
  }
}
