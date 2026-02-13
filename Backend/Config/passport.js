import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { user as User } from "../Models/userModel.js";

// 3. Google Strategy Logic
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://electromart-backend-five.vercel.app/api/v1/auth/google/callback",
            proxy: true 
        },
        async (accessToken, refreshToken, profile, done) => { // Changed 'cb' to 'done' for clarity
            try {
                let user = await User.findOne({ googleId: profile.id });
s
                if (!user) {
                    user = await User.findOne({ email: profile.emails[0].value });
                    if (user) {
                        user.googleId = profile.id;
                        await user.save();
                    } else {
                        user = await User.create({
                            googleId: profile.id,
                            username: profile.displayName,
                            email: profile.emails[0].value,
                            avatar: profile.photos[0].value,
                            isLoggedIn: true,
                            isVerified: true,
                        });
                    }
                }
                return done(null, user); // Make sure this is returning!
            } catch (error) {
                console.error("Strategy Error:", error);
                return done(error, null);
            }
        }
    )
);

export default passport;
