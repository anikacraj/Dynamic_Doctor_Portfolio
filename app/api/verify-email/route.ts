import User from '@/models/user.model'
import { NextResponse } from 'next/server'
 import crypto from 'crypto'
 import { dbConnect } from '@/config/dbConnect'

 export async function GET(request:Request){
    try {
        await dbConnect();
const {searchParams} =new URL(request.url)
const verificationToken =searchParams.get("verifyToken") as string
const userId =searchParams.get("id");

const verifyToken = crypto.createHash('sha256')
  .update(verificationToken)
  .digest('hex');

  const user = await User.findOne(
   {
    _id: userId,
    verifyToken,
    verifyTokenExpire:{
        $gt :new Date()
    }
   }
  )
if(!user){
    return new Response("Invalid verification token", {
        status: 400,
        })
}
user.isVerified= true;
user.verifyToken =undefined;
user.verifyTokenExpire =undefined;

await user.save();
return new Response("Email verified successfully", {
    status: 200,
    })

    } catch (error) {
        return NextResponse.json(
            { status: 500, message: 'Internal Server Error' },
             { status: 500 }

        )
    }


 }