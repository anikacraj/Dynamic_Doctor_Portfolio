//app\api\users\[userId]\Blog\[BlogId]\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/config/dbConnect';
import mongoose from 'mongoose';
import userModel from '@/models/user.model';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; blogId: string } }
) {
  await dbConnect();

  const { userId, blogId } = params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json({ error: 'Invalid ID(s)' }, { status: 400 });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const blog = user.blogs.id(blogId);
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    return NextResponse.json({ blog, doctorName: user.name }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
