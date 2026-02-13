import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import { isAuthenticated } from "../Middlewares/isAuthenticated.js"
const router = express.Router();

// step-1 edirect to google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        try {
            if (!req.user) {
                return res.redirect("https://electro-mart-shop.vercel.app/login?error=user_not_found");
            }

            const token = jwt.sign(
                { id: req.user._id, email: req.user.email },
                process.env.SECRET_KEY,
                { expiresIn: "5d" }
            );

            // Frontend success page par bhein token ke sath
            res.redirect(`https://electro-mart-shop.vercel.app/auth-success?token=${token}`);
        } catch (error) {
            console.error("Callback Error:", error);
            res.redirect("https://electro-mart-shop.vercel.app/login?error=google_failed");
        }
    }
)
router.get("/me", isAuthenticated, (req, res) => {
    res.json({ success: true, user: req.user })
})

export default router
