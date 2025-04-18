// File: /app/api/users/[userId]/route.ts
import { dbConnect } from "@/config/dbConnect";
import userModel from "@/models/user.model";
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
  degrees: { name: string; college: string; year: string }[];
  work: { college: string; day: string; time: string }[];
  experience: { college: string; startingYear: string; endingYear: string }[];
  chamber: { place: string; day: string; time: string }[];
  gallery: string[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect();

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



export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect();

  try {
    const body: DoctorProfile = await req.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.specialization) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      params.userId,
      {
        $set: {
          name: body.name,
          email: body.email,
          phoneNo: body.phoneNo,
          optionalEmail: body.optionalEmail,
          registerId: body.registerId,
          specialization: body.specialization,
          mbbsCollege: body.mbbsCollege,
          profilePhoto: body.profilePhoto,
          degrees: body.degrees,
          work: body.work,
          experience: body.experience,
          chamber: body.chamber,
          gallery: body.gallery,
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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