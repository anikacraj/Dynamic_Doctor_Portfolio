// app/api/contact/route.ts

import { dbConnect } from "@/config/dbConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface ContactData {
  name: string;
  email: string;
  address?: string;
  phoneNo?: string;
  message: string;
  patientDate?: string;
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Valid doctor ID is required" },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      address,
      phoneNo,
      message,
      patientDate,
    }: ContactData = await request.json();

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim() || !patientDate?.trim()) {
      return NextResponse.json(
        { error: "Name, email, date and message are required fields" },
        { status: 400 }
      );
    }

    // Create new contact entry
    const newContact = {
      name: name.trim(),
      email: email.trim(),
      address: address?.trim() || "",
      phoneNo: phoneNo?.trim() || "",
      message: message.trim(),
      patientDate: patientDate.trim(),
      status: "pending",
      createdAt: new Date(),
    };

    // Update user with new contact
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

    const addedContact = updatedUser.contacts[updatedUser.contacts.length - 1];

    // ✅ Console log BEFORE return
    console.log("Received contact data:", {
      name,
      email,
      address,
      phoneNo,
      message,
      patientDate,
    });

    console.log("Added contact:", addedContact);

    return NextResponse.json(
      { message: "Appointment request submitted successfully", contact: addedContact },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
