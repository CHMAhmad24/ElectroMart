import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { user as User } from "../Models/userModel.js";

// 1. Serialize User: User ki ID ko session mein save karne ke liye
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// 2. Deserialize User: Session ID se user ka data nikalne ke liye
passport.deserializeUser(async (id, done) => {
    try {
        const foundUser = await User.findById(id);
        done(null, foundUser);
    } catch (err) {
        done(err, null);
    }
});

// 3. Google Strategy Logic
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://electromart-backend-five.vercel.app/api/v1/auth/google/callback",
            proxy: true 
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                let foundUser = await User.findOne({ googleId: profile.id });

                if (!foundUser) {
                    foundUser = await User.create({
                        googleId: profile.id,
                        username: profile.emails[0].value.split("@")[0],
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        isLoggedIn: true,
                        isVerified: true,
                    });
                    console.log("New Google User Created:", foundUser.username);
                } else {
                    // Agar purana user hai toh sirf status update karein
                    foundUser.isLoggedIn = true;
                    await foundUser.save();
                    console.log("Existing Google User Logged In:", foundUser.username);
                }

                return cb(null, foundUser);
            } catch (error) {
                console.error("Error in Google Strategy:", error);
                return cb(error, null);
            }
        }
    )
);

export default passport;
