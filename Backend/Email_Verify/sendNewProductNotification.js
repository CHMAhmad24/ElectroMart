import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendNewProductNotification = async (emails, product) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    });

    const mailOptions = {
        from: `"ElectroMart" <${process.env.MAIL_USER}>`,
        bcc: emails, // Use BCC so users don't see each other's emails
        subject: `New Product: ${product.productName} is now available!`,
        html: `
            <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px;">
                <h2>New Product Alert!</h2>
                <img src="${product.productImg[0]?.url}" alt="${product.productName}" style="width: 200px; border-radius: 8px;" />
                <h3>${product.productName}</h3>
                <p><strong>Price:</strong> $${product.productPrice}</p>
                <p>${product.productDesc}</p>
                <a href="https://electro-mart-shop.vercel.app/product/${product._id}" 
                   style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                   View Product
                </a>
                <br/><br/>
                <hr/>
                <p style="font-size: 12px; color: #666;">You received this because you are subscribed to ElectroMart updates.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};