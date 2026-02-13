import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import { isAuthenticated } from "../Middlewares/isAuthenticated.js"
const router = express.Router();

// step-1 edirect to google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "https://electro-mart-shop.vercel.app/login" }),
    (req, res) => {
        try {
            if (!req.user) {
                return res.redirect("https://electro-mart-shop.vercel.app/login?error=auth_failed");
            }

            const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.SECRET_KEY, { expiresIn: "5d" });

            // Frontend success page par bheje token ke sath
            res.redirect(`https://electro-mart-shop.vercel.app/auth-success?token=${token}`);
        } catch (error) {
            console.log("JWT Signing Error:", error);
            res.status(500).send("Internal Server Error during token generation");
        }
    }
)
router.get("/me", isAuthenticated, (req, res) => {
    res.json({ success: true, user: req.user })
})

export default router
