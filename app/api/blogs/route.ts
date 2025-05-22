// app/api/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/config/dbConnect';
import userModel from '@/models/user.model';

export async function GET() {
  await dbConnect();
  try {
    const users = await userModel.find({}, { blogs: 1, name: 1 });

    const allBlogs = users.flatMap((user: any) =>
      user.blogs.map((blog: any) => ({
        ...blog.toObject(),
        doctorName: user.name,
        doctorId: user._id.toString(),
      }))
    );

    allBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ blogs: allBlogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
