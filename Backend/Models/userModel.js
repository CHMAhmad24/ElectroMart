import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    profilePic: { type: String, default: "" }, // Cloudinary Image URL
    profilePicPublicId: { type: String, default: "" }, // Cloudinary Image Public ID for deletion
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // password required only if NOT a Google user
        }
    },
    username: { type: String, unique: true, sparse: true },
    googleId: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: String, default: false },
    isSubscribed: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    address: { type: String },
    city: { type: String },
    zipCode: { type: String },
    phoneNo: { type: String },
}, { timestamps: true })

export const user = mongoose.model("user", userSchema);
