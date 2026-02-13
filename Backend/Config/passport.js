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
        async (accessToken, refreshToken, profile, cb) => {
            // passport.js mein strategy logic ko aise update karein:
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    // 1. Pehle dekhein kya is Google ID se koi user hai?
                    let user = await User.findOne({ googleId: profile.id });

                    if (!user) {
                        // 2. Agar nahi, to check karein kya is email se koi normal account hai?
                        user = await User.findOne({ email: profile.emails[0].value });

                        if (user) {
                            user.googleId = profile.id;
                            user.avatar = profile.photos[0].value;
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
                    return cb(null, user);
                } catch (error) {
                    return cb(error, null);
                }
            }
        }
    )
);

export default passport;
