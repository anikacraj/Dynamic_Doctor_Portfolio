import bcrypt from "bcryptjs";
import User from "@/models/user.model"
import { NextResponse } from "next/server";
import {DoctorProfileEditor} from "@/app/[userId]/editProfile/page"

import  {dbConnect} from "@/config/dbConnect"


export async function POST(request:Request){
    try {
        await dbConnect();
        const body =await request.json();
        const{name,}
    } catch (error) {
        
    }
}