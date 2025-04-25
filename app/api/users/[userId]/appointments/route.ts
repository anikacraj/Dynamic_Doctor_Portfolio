import { dbConnect } from "@/config/dbConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface Appointment {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phoneNo: string;
  address: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt?: Date;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnect();

  try {
    const { userId } = params;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as 'pending' | 'accepted' | 'rejected' | null;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid doctor ID format" 
        },
        { status: 400 }
      );
    }

    // Validate status parameter if provided
    if (status && !['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid status value. Must be 'pending', 'accepted', or 'rejected'" 
        },
        { status: 400 }
      );
    }

    // Get user with only contacts populated
    const user = await userModel.findById(userId)
      .select('contacts')
      .lean();

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: "Doctor not found" 
        },
        { status: 404 }
      );
    }

    // Process contacts with proper typing
    let appointments: Appointment[] = user.contacts.map(contact => ({
      ...contact,
      status: contact.status || 'pending' // Default to pending if missing
    }));

    // Filter by status if valid
    if (status) {
      appointments = appointments.filter(appt => appt.status === status);
    }

    // Sort by date (newest first)
    appointments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(
      { 
        success: true,
        count: appointments.length,
        appointments 
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error("Appointments fetch error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch appointments. Please try again later."
      },
      { status: 500 }
    );
  }
}