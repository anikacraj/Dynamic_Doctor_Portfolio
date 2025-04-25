import { NextResponse } from 'next/server';
import { dbConnect } from '@/config/dbConnect';
import userModel from '@/models/user.model'; // Adjust this to your actual model
import { sendEmail } from '@/utils/sendGmail';

export async function POST(req: Request) {
  try {
    const { to, subject, text, html, userId } = await req.json();

    // Fetch doctor's email from DB based on userId
    await dbConnect();
    const doctor = await userModel.findById(userId);  // Assuming Doctor model has a `userId` field
    if (!doctor || !doctor.email) {
      return NextResponse.json({ error: 'Doctor email not found' }, { status: 404 });
    }

    // Now send the email from the doctor's email
    const response = await sendEmail({
      from: doctor.email,
      to,
      subject,
      text,
      html,
    });

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
