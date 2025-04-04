import nodemailer from 'nodemailer'

export const sendEmail = async (userEmail:string, 
    subject: string, message: string) => {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
              auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
              },
            });

            const mailOptions = {
                from: process.env.SMTP_FROM_EMAIL,
                to: userEmail,
                subject,
                html: message
                };
                await transporter.sendMail(mailOptions);
        }
        catch(err){
            console.log(err)
        }

    }