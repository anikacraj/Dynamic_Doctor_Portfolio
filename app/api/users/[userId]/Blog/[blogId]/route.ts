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


export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string; blogId: string } }
) {
  try {
    const { userId, blogId } = params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blogIndex = user.blogs.findIndex((b: any) => b._id.toString() === blogId);
    if (blogIndex === -1) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    user.blogs.splice(blogIndex, 1);
    await user.save();

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string; blogId: string } }
) {
  try {
    const { userId, blogId } = params;
    const { heading, text } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blog = user.blogs.id(blogId);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    blog.heading = heading || blog.heading;
    blog.text = text || blog.text;
    // DO NOT update images here
    blog.updatedAt = new Date(); // Optional: ensure updatedAt is set
    await user.save();

    return NextResponse.json({ message: 'Blog updated successfully', blog }, { status: 200 });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

