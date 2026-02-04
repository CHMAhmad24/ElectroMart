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
        html: `
            <h3>Welcome to ElectroMart!</h3>
            <p>Please click the link below to verify your email:</p>
            <a href="https://electro-mart-shop.vercel.app/api/v1/user/verify/${token}">Verify My Email</a>
            <p>If the link doesn't work, copy paste this: https://electro-mart-shop.vercel.app/api/v1/user/verify/${token}</p>
        `
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
