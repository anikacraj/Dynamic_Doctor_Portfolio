// app/api/users/[userId]/blog/[blogId]/click/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/config/dbConnect';
import userModel from '@/models/user.model';

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string; blogId: string } }
) {
  await dbConnect();

  const { userId: doctorId, blogId } = params;

  try {
    const user = await userModel.findOne({ _id: doctorId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blog = user.blogs.id(blogId);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Prevent the blog owner from incrementing their own clicks
    const requestUserId = req.headers.get('x-user-id'); // Optional: Track logged-in users
    if (requestUserId && requestUserId === doctorId) {
      return NextResponse.json(
        { error: 'You cannot increment your own blog clicks' },
        { status: 403 }
      );
    }

    // Increment the click count
    blog.like = (blog.like || 0) + 1;
    await user.save();

    return NextResponse.json({ 
      message: 'Click count updated', 
      like: blog.like 
    });
  } catch (error) {
    console.error('Error updating like count:', error);
    return NextResponse.json(
      { error: 'Failed to update like count' },
      { status: 500 }
    );
  }
}