// File: /app/api/users/[userId]/route.ts
import { dbConnect } from "@/config/dbConnect";
import userModel from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface DoctorProfile {
  name: string;
  email: string;
  phoneNo: string;
  optionalEmail: string;
  registerId: string;
  specialization: string;
  mbbsCollege: string;
  profilePhoto: string;

  ContactNo: string;
  bio: string;
  aboutPicture: string;
  fbLink: string;
  instagram: string;
  Linkedin: string;
  youTubeLink: string;
 
  degrees: { name: string; college: string; year: string }[];
  education: { year: string; examName: string; institute: string }[];
  work: { role: string; college: string; day: string; time: string; collegePhoneNumber: string }[];
  experience: { role: string; college: string; startingYear: string; endingYear: string }[];
  chamber: { place: string; day: string; time: string; bookContact: string }[];
  contacts:{name:string;email:string;address:string;phoneNo:string;message:string}[];
  gallery: string[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect();

  // Add validation for ObjectId
  if (!mongoose.Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      { error: "Invalid user ID format" },
      { status: 400 }
    );
  }

  try {
    const user = await userModel.findById(params.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function PUT(request: NextRequest, context: { params: { userId: string } }) {
  try {
    const { userId } = context.params; // ✅ correct way to get userId
    const data = await request.json();

    const updateFields = { ...data };

    // ❗Optional: Remove undefined fields to avoid issues
    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      // ✅ Handle duplicate key error for unique fields
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `Duplicate value for unique field: ${field}` },
        { status: 400 }
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect();

  try {
    const deletedUser = await userModel.findByIdAndDelete(params.userId);
    
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}