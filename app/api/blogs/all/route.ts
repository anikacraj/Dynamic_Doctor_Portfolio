// /app/api/blogs/all/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/config/dbConnect';
import userModel from '@/models/user.model';
import { Images } from 'lucide-react';

export async function GET() {
  await dbConnect();

  try {
    // Fetch all users with blogs
    const users = await userModel.find({}, 'name blogs');

    const allBlogs = users.flatMap(user => {
      return user.blogs.map((blog: { _id: any; heading: any; images:string; text: any; createdAt: any; like: any; }) => ({
        _id: blog._id,
        heading: blog.heading,
        images:blog.images,
        text: blog.text,
        doctorId: user._id,
        doctorName: user.name,
        createdAt: blog.createdAt,
        like: blog.like || 0,
      }));
    });

    // Sort by creation time (or any criteria)
    allBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ blogs: allBlogs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
