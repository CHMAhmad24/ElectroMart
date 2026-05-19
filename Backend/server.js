import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import userRoute from './Routes/UserRoutes.js';
import ProductsRoutes from './Routes/ProductsRoutes.js'
import CartRoutes from './Routes/CartRoutes.js'
import cors from 'cors';
import authRoute from './Routes/authRoute.js'
import orderRoutes from './Routes/orderRoutes.js'
import "./Config/passport.js"
import './Models/userModel.js';
import './Models/orderModel.js';
import './Models/productModel.js';

const app = express()

app.use(express.json())

// 1. Session Configuration (Vercel/Production proxy ke liye trust proxy zaroori hai)
app.set("trust proxy", 1); 

app.use(session({
  secret: process.env.SECRET_KEY || 'your_local_secret_key',
  resave: false,
  saveUninitialized: false, 
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Live par HTTPS hoga toh true, local par false
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Frontend aur Backend alag domain par chalne ke liye
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// 2. CORS Configuration (Sabhi links ko allow karne ke liye * use kiya hai taaki koi error na aaye)
app.use(cors({
  origin: true, // Yeh automatic aapke frontend ke URL ko accept kar lega
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, 
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// 3. MongoDB Connection
let isConnected = false
const connectToDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'ElectroMartDB',
            serverSelectionTimeoutMS: 5000 
        });
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

app.use(async (req, res, next) => {
    try {
        await connectToDB();
        next();
    } catch (err) {
        res.status(500).json({ error: "Database connection failed", details: err.message });
    }
});

// Routes
app.use('/api/v1/user', userRoute)
app.use('/api/v1/products', ProductsRoutes)
app.use('/api/v1/cart', CartRoutes)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/order', orderRoutes)

app.get("/", (req, res) => res.send("ElectroMart API is live on Vercel."))

// 4. Server Start (Vercel bina app.listen ke chalta hai, isliye isko condition me daal diya)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running locally on http://localhost:${PORT}`);
    });
}

export default app;
