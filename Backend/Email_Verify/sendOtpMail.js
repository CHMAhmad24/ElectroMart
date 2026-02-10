import nodemailer from 'nodemailer';
import 'dotenv/config';


export const sendOTPMail = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html: `<p>Your OTP for password reset is <b>${otp}</b></p>`
    };

    try {
        const info = await transporter.sendMail(mailConfigurations);
        console.log('OTP Sent Successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw error; // This ensures your controller's catch block triggers
    }
}

