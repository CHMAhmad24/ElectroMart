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
            const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.SECRET_KEY, { expiresIn: "5d" })
            res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`)
        } catch (error) {
            console.error("Google Login Error", error)
            res.redirect(`${process.env.CLIENT_URL}/login?error=google_login_failed`)
        }
    }
)

router.get("/me", isAuthenticated, (req, res) => {
    res.json({ success: true, user: req.user })
})

export default router