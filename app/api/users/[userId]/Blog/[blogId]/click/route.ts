// app/api/users/[userId]/blog/[blogId]/click/route.ts
// ✅ Uses `like` field to count blog open events

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/config/dbConnect';
import userModel from '@/models/user.model';

export async function PUT(
  req: NextRequest,
  { params }: { params: { blogId: string } }
) {
  await dbConnect();

  const { blogId } = params;

  try {
    const user = await userModel.findOne({ 'blogs._id': blogId });

    if (!user) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const blog = user.blogs.id(blogId);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found in user' }, { status: 404 });
    }

    blog.like = (blog.like || 0) + 1;
    await user.save();

    return NextResponse.json({ message: 'Like (click) count updated' });
  } catch (error) {
    console.error('Error updating like count:', error);
    return NextResponse.json({ error: 'Failed to update like count' }, { status: 500 });
  }
}
