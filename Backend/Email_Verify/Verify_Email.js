import nodemailer from 'nodemailer';
import 'dotenv/config';

export const verifyEmail = async (token, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    });

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Email Verification - ElectroMart',
        // HTML use karein taake link clickable ho email mein
        text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           https://electro-mart-shop.vercel.app/verify/${token} 
           Thanks`
    };

    // Vercel/Serverless ke liye wrap in a Promise
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailConfigurations, (error, info) => {
            if (error) {
                console.error("Nodemailer Error:", error);
                reject(error);
            } else {
                console.log("Email Sent: " + info.response);
                resolve(info);
            }
        });
    });
}
