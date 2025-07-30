// app/api/users/[userId]/Blog/[blogId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/config/dbConnect';
import mongoose from 'mongoose';
import userModel from '@/models/user.model';

// Helper function for ID validation
const validateIds = (userId: string, blogId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId) {
    return { valid: false, error: 'Invalid User ID' };
  }
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return { valid: false, error: 'Invalid Blog ID' };
  }
  return { valid: true };
};

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; blogId: string } }
) {
  try {
    await dbConnect();
    const { userId, blogId } = params;

    // Validate IDs
    const { valid, error } = validateIds(userId, blogId);
    if (!valid) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const user = await userModel.findById(userId).select('name blogs');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blog = user.blogs.id(blogId);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      blog: blog.toObject(), 
      doctorName: user.name 
    });

  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string; blogId: string } }
) {
  try {
    await dbConnect();
    const { userId, blogId } = params;
    const updateData = await req.json();

    // Validate IDs
    const { valid, error } = validateIds(userId, blogId);
    if (!valid) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Validate input data
    if (!updateData || (typeof updateData !== 'object')) {
      return NextResponse.json(
        { error: 'Invalid update data' },
        { status: 400 }
      );
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blog = user.blogs.id(blogId);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Update only allowed fields
    if (updateData.heading) blog.heading = updateData.heading;
    if (updateData.text) blog.text = updateData.text;
    blog.updatedAt = new Date();

    await user.save();

    return NextResponse.json({
      message: 'Blog updated successfully',
      blog: blog.toObject()
    });

  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string; blogId: string } }
) {
  try {
    await dbConnect();
    const { userId, blogId } = params;

    // Validate IDs
    const { valid, error } = validateIds(userId, blogId);
    if (!valid) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blogIndex = user.blogs.findIndex(
      (blog: any) => blog._id.toString() === blogId
    );
    
    if (blogIndex === -1) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    user.blogs.splice(blogIndex, 1);
    await user.save();

    return NextResponse.json(
      { message: 'Blog deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}