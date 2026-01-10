import { NextRequest, NextResponse } from 'next/server';
import { createComment, getApprovedComments } from '@/db/queries';
import { z } from 'zod';
import { isDatabaseEnabled } from '@/db';

// 验证评论数据的 schema
const commentSchema = z.object({
  authorName: z.string().min(1, '姓名不能为空').max(100, '姓名过长'),
  authorEmail: z.string().email('邮箱格式不正确'),
  content: z.string().min(1, '评论内容不能为空').max(2000, '评论内容过长'),
  parentId: z.number().nullable().optional(),
});

// GET - 获取文章的评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // 检查数据库是否可用
  if (!isDatabaseEnabled) {
    return NextResponse.json({
      comments: [],
      count: 0,
    });
  }

  try {
    const { slug } = await params;
    const comments = await getApprovedComments(slug);

    return NextResponse.json({
      comments,
      count: comments.length,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST - 创建新评论
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

    // 验证数据
    const validatedData = commentSchema.parse(body);

    // 创建评论（将 null 转换为 undefined）
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
      // 将验证错误转换为更友好的格式
      const errorMap: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errorMap[field] = issue.message;
      });

      return NextResponse.json(
        {
          error: errorMap.authorName || errorMap.authorEmail || errorMap.content || '验证失败',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
