import { NextRequest, NextResponse } from 'next/server';
import { approveComment, rejectComment, deleteComment, getPendingComments } from '@/db/queries';

// 管理员审核评论的 API
// 注意：实际生产环境需要添加身份验证

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action } = body;

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
  try {
    const { id } = await params;
    const commentId = parseInt(id);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

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
