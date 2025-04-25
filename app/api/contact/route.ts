import { dbConnect } from "@/config/dbConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose"; // Added import

interface ContactData {
  name: string;
  email: string;
  address?: string;
  phoneNo?: string;
  message: string;
  userId: string;
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { name, email, address, phoneNo, message, userId }: ContactData = await request.json();
    
    // Enhanced validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields" },
        { status: 400 }
      );
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Valid doctor ID is required" },
        { status: 400 }
      );
    }

    const newContact = {
      name: name.trim(),
      email: email.trim(),
      address: address?.trim() || "",
      phoneNo: phoneNo?.trim() || "",
      message: message.trim(),
      status: "pending", // Explicit default
      createdAt: new Date(),
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { contacts: newContact } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    // Get the newly added contact
    const addedContact = updatedUser.contacts[updatedUser.contacts.length - 1];

    return NextResponse.json(
      { 
        message: "Appointment request submitted successfully", 
        contact: addedContact 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Contact submission error:", {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: error.message.includes("duplicate") 
          ? "This appointment already exists" 
          : "Internal server error" 
      },
      { status: 500 }
    );
  }
}