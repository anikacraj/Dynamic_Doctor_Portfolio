import { dbConnect } from "@/config/dbConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Interface for the expected request body
interface StatusUpdateRequest {
  status: 'accepted' | 'rejected';
  userId: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { contactId: string } }
) {
  await dbConnect();

  try {
    const { status, userId }: StatusUpdateRequest = await request.json();
    const { contactId } = params;

    // Validate inputs
    if (!status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status must be either 'accepted' or 'rejected'" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(contactId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const updateTime = new Date();

    // Find user first to make sure user exists
    const user = await userModel.findById(userId).select("contacts");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    // Find specific contact
    const contactIndex = user.contacts.findIndex(contact => contact._id.toString() === contactId);

    if (contactIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Update contact status and updatedAt manually
    user.contacts[contactIndex].status = status;
    user.contacts[contactIndex].updatedAt = updateTime;

    // Save the user
    await user.save();

    const updatedContact = user.contacts[contactIndex];

    return NextResponse.json(
      {
        success: true,
        status,
        message: `Appointment ${status} successfully`,
        contact: updatedContact
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Appointment status update error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update appointment status",
        details: error.message
      },
      { status: 500 }
    );
  }
}
