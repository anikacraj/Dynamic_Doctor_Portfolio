import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "@/config/dbConnect";
import User from "@/models/user.model";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await dbConnect();

  try {
    const user = await User.findById(params.userId).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  try {
    await dbConnect();
    const allUsers = await User.find(); // you can filter by role if needed
    return NextResponse.json(allUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
