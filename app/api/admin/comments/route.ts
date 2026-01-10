import { NextResponse } from 'next/server';
import { getPendingComments } from '@/db/queries';

// 获取所有待审核评论
export async function GET() {
  try {
    const comments = await getPendingComments();
    return NextResponse.json({ comments, count: comments.length });
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending comments' },
      { status: 500 }
    );
  }
}
