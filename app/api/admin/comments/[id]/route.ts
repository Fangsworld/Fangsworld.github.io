import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth.server';

// 管理员审核评论的 API
// 所有管理操作先验证服务端 Bearer token，再访问数据库。

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rejection = requireAdmin(request);
  if (rejection) return rejection;

  try {
    const { id } = await params;
    const commentId = Number(id);

    if (!/^\d+$/.test(id) || !Number.isSafeInteger(commentId) || commentId <= 0) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action } = body;

    const { approveComment, rejectComment } = await import('@/db/queries');
    if (action === 'approve') {
      const comment = await approveComment(commentId);
      return NextResponse.json({ comment, message: '评论已批准' });
    } else if (action === 'reject') {
      const comment = await rejectComment(commentId);
      return NextResponse.json({ comment, message: '评论已拒绝' });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rejection = requireAdmin(request);
  if (rejection) return rejection;

  try {
    const { id } = await params;
    const commentId = Number(id);

    if (!/^\d+$/.test(id) || !Number.isSafeInteger(commentId) || commentId <= 0) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const { deleteComment } = await import('@/db/queries');
    const comment = await deleteComment(commentId);
    return NextResponse.json({ comment, message: '评论已删除' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
