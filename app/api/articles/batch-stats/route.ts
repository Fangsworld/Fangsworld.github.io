import { NextRequest, NextResponse } from 'next/server';
import { getArticlesStats } from '@/db/queries';
import { isDatabaseEnabled } from '@/db';

// GET - 批量获取多篇文章的统计数据
export async function GET(request: NextRequest) {
  // 检查数据库是否可用
  if (!isDatabaseEnabled) {
    return NextResponse.json({ stats: [] });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const slugsParam = searchParams.get('slugs');

    if (!slugsParam) {
      return NextResponse.json(
        { error: 'Missing slugs parameter' },
        { status: 400 }
      );
    }

    const slugs = slugsParam.split(',');

    // 批量获取统计数据
    const stats = await getArticlesStats(slugs);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching batch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
