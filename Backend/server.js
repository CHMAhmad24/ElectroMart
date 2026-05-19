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
const PORT = process.env.PORT || 8000

app.use(express.json())

// 1. Session Configuration (Sirf Localhost ke liye bilkul simple)
app.use(session({
  secret: process.env.SECRET_KEY || 'your_local_secret_key',
  resave: false,
  saveUninitialized: false, 
  cookie: { 
    secure: false,       // Localhost pe HTTP hota hai, isliye false
    sameSite: 'lax',     // Local routing aur auth ke liye 'lax' perfect hai
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// 2. CORS Configuration (Sirf aapke local Vite frontend ke liye)
app.use(cors({
  origin: "http://localhost:5173", // Aapka frontend local port
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,               // Cookies/Sessions pass karne ke liye zaroori hai
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

app.get("/", (req, res) => res.send("ElectroMart API is live on Localhost."))

// 4. Server Start (Bina kisi condition ke seedha listen karega)
app.listen(PORT, () => {
    console.log(`Server is running locally on http://localhost:${PORT}`);
});

export default app;