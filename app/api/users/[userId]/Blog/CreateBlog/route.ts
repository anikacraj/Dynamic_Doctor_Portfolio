import { NextResponse } from "next/server";
import { dbConnect } from "@/config/dbConnect";
import Blog from "@/models/user.model";

// Define the config to allow larger body size
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Increase the body size limit to 10 MB
    },
  },
};

// POST create a new blog (stored in MongoDB)
export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const heading = formData.get("heading");
    const text = formData.get("text");

    const imageFiles = formData.getAll("images") as File[];
    const imageUrls = await Promise.all(imageFiles.map(async (file) => URL.createObjectURL(file)));

    if (!heading || !text) {
      return NextResponse.json({ error: "Heading and text are required." }, { status: 400 });
    }

    // Create and save the blog in MongoDB
    const newBlog = await Blog.create({
      heading,
      text,
      images: imageUrls,
      like: 0,
      dislike: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json(newBlog);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create blog." }, { status: 500 });
  }
}
