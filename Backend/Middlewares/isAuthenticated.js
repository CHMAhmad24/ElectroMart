import jwt from "jsonwebtoken";
import { user as User } from "../Models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({
                success: false,
                message: 'Authorization Token is missing or Invalid'
            });
        }
        const token = authHeader.split(' ')[1];
        let decoded
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({
                    success: false,
                    message: 'Registeration Token has expired'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Access Token is missing or Invalid'
            });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        req.user = user;
        req.id = user._id;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Authentication required'
        });
    }
}

export const isAdmin = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        res.status(403).json({
            success:false, 
            message:'Access denied: Admins only'
        });
    }
}