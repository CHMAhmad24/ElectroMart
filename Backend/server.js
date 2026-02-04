import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose';
import passport from 'passport';
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
app.set("trust proxy", 1);
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true, 
  cookie: { 
    secure: true, // Vercel is HTTPS
    sameSite: 'none' 
  }
}));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(cors({
  origin: "https://electro-mart-shop.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

let isConnected = false
const connectToDB = async () => {
    if (isConnected) return;
    try {
        // Reduced timeout so it doesn't hang forever
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'ElectroMartDB',
            serverSelectionTimeoutMS: 5000 
        });
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; // Throw so the middleware can catch it
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

app.use('/api/v1/user', userRoute)
app.use('/api/v1/products', ProductsRoutes)
app.use('/api/v1/cart', CartRoutes)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/order', orderRoutes)

// do not use app.listen() in vercel
app.get("/", (req, res) => res.send("ElectroMart API is live and connected."))
export default app;
