import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import { isAuthenticated } from "../Middlewares/isAuthenticated.js"
const router = express.Router();

// step-1 edirect to google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback",
    passport.authenticate("google", { 
        session: false, 
        failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed` 
    }),
    (req, res) => {
        try {
            if (!req.user) {
                throw new Error("No user object found");
            }
            const token = jwt.sign(
                { id: req.user._id, email: req.user.email }, 
                process.env.SECRET_KEY, 
                { expiresIn: "5d" }
            );
            res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
        } catch (error) {
            console.error("JWT Error:", error);
            res.status(500).json({ message: "Internal Server Error during token creation", error: error.message });
        }
    }
);
router.get("/me", isAuthenticated, (req, res) => {
    res.json({ success: true, user: req.user })
})

export default router
