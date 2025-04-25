import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;   // Now accepting dynamic "from" email
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ from, to, subject, text, html }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,  // Your own Gmail credentials for authentication
      pass: process.env.GMAIL_PASS,  // Gmail password or app password
    },
  });

  const mailOptions = {
    from: `"Appointment Team" <${from}>`, // Dynamic sender
    to,
    subject,
    text,   // fallback if HTML fails
    html,   // the HTML version
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.response);
}
