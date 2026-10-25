import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth.server';

// 获取所有待审核评论
export async function GET(request: Request) {
  const rejection = requireAdmin(request);
  if (rejection) return rejection;

  try {
    const { getPendingComments } = await import('@/db/queries');
    const comments = await getPendingComments();
    return NextResponse.json({ comments, count: comments.length }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending comments' },
      { status: 500 }
    );
  }
}
