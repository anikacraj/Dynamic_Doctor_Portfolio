import { dbConnect } from "@/config/dbConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { name, email, address, phoneNo, message, userId } = await request.json();
    console.log("Received data:", { name, email, address, phoneNo, message, userId });

    // Validate required fields
    if (!name || !email || !message) {
      console.error("Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "Name, email, and message are required fields" },
        { status: 400 }
      );
    }

    if (!userId) {
      console.error("Validation failed: Missing userId");
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const newContact = {
      name,
      email,
      address: address || "",
      phoneNo: phoneNo || "",
      message,
      
      createdAt: new Date(),
    };

    console.log("Attempting to update user:", userId);
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { contacts: newContact } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.error("User not found with ID:", userId);
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    console.log("Successfully updated user:", updatedUser._id);
    return NextResponse.json(
      { message: "Contact form submitted successfully", contact: newContact },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Full error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}