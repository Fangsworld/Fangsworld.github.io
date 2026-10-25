import { NextRequest, NextResponse } from 'next/server';
import { createComment, getApprovedComments } from '@/db/queries';
import { z } from 'zod';
import { isDatabaseEnabled } from '@/db';

const commentSchema = z.object({
  authorName: z.string().trim().min(1, '姓名不能为空').max(100, '姓名过长'),
  authorEmail: z.string().email('邮箱格式不正确'),
  content: z.string().trim().min(1, '评论内容不能为空').max(2000, '评论内容过长'),
  parentId: z.number().int().positive().nullable().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDatabaseEnabled) {
    return NextResponse.json({ comments: [], count: 0 });
  }

  try {
    const { slug: rawSlug } = await params;
    const slug = encodeURIComponent(decodeURIComponent(rawSlug));
    const comments = await getApprovedComments(slug);
    // Public responses must not expose authors' email addresses or moderation fields.
    const publicComments = comments.map(({ id, authorName, content, createdAt, parentId }) => ({
      id, authorName, content, createdAt, parentId,
    }));
    return NextResponse.json({ comments: publicComments, count: publicComments.length });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDatabaseEnabled) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { slug: rawSlug } = await params;
    const slug = encodeURIComponent(decodeURIComponent(rawSlug));
    const validatedData = commentSchema.parse(await request.json());
    const comment = await createComment({
      articleSlug: slug,
      authorName: validatedData.authorName,
      authorEmail: validatedData.authorEmail,
      content: validatedData.content,
      parentId: validatedData.parentId ?? undefined,
    });
    return NextResponse.json({
      comment,
      message: '评论提交成功，等待审核后显示',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: error.issues[0]?.message || '验证失败',
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
