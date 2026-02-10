import { user as User } from "../Models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { verifyEmail } from "../Email_Verify/Verify_Email.js";
import { Session } from "../Models/sessionModel.js";
import { sendOTPMail } from "../Email_Verify/sendOtpMail.js";
import cloudinary from "../utils/cloudinary.js";


export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '5d' });
        try {
            await verifyEmail(token, email); // Send verification email
            console.log("Verification email triggered successfully");
        } catch (mailError) {
            console.error("Mail sending failed:", mailError);
        }
        newUser.token = token;
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: newUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        })
    }
}

export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authorization Token is missing or Invalid' });
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
                    message: 'Token has expired'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Token Verification Failed'
            });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        user.token = null;
        user.isVerified = true;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Email verification failed",
            error: error.message
        })
    }
}

export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' });
        verifyEmail(token, email);
        user.token = token;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Verification email Resent successfully",
            token: user.token
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Verification email Resending failed",
            error: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }
        
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (existingUser.isVerified === false) {
            return res.status(400).json({
                success: false,
                message: "Verify your email to login"
            });
        }

        // 2. Token Generation (Logic corrected: Access 1d, Refresh 7d)
        const accessToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

        existingUser.isLoggedIn = true;
        await existingUser.save();

        // Session management
        await Session.deleteOne({ userId: existingUser._id });
        await Session.create({ userId: existingUser._id });

        // 3. Sensitive information ko frontend par bhejne se pehle delete karna
        const userResponse = existingUser.toObject();
        delete userResponse.password; // Password ko response se remove kiya
        delete userResponse.otp;
        delete userResponse.otpExpiry;
        delete userResponse.token;

        return res.status(200).json({
            success: true,
            message: `Login successful. Welcome back ${existingUser.firstName}`,
            user: userResponse, // Ab clean object jayega
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
}


export const logout = async (req, res) => {
    try {
        const userId = req.id;
        await Session.deleteMany({ userId: userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 123456
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
        user.otp = otp
        user.otpExpiry = otpExpiry
        await user.save();

        await sendOTPMail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent to email"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Password reset failed",
            error: error.message
        })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email;
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP is not generated or already used"
            });
        }

        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired please request a new one"
            });
        }

        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "OTP verification failed",
            error: error.message
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const email = req.params.email;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Change password failed",
            error: error.message
        })
    }
}

export const allUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching users failed",
            error: error.message
        })
    }

}

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // extract user ID from request params
        const user = await User.findById(userId).select('-password -otp -otpExpiry -token');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        })
        console.log(user); // should show all user fields

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching user failed",
            error: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id; // The id of the user to be updated
        const loggedInUser = req.user //from isAuthenticated middleware
        const { firstName, lastName, username, address, city, zipCode, phoneNo, role } = req.body;
        if (loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this user"
            })
        }
        let user = await User.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        // if new file is uploaded

        if (req.file) {
            console.log("Uploaded file:", {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });

            if (!req.file.buffer) {
                return res.status(400).json({
                    success: false,
                    message: "File buffer missing"
                });
            }
            if (!req.file.mimetype.startsWith("image/")) {
                return res.status(400).json({
                    success: false,
                    message: "Only image files are allowed"
                });
            }

            if (req.file.size > 2 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: "Image must be under 2MB"
                });
            }

            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId);
            }
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profiles" }, (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )
                stream.end(req.file.buffer)
            })
            profilePicUrl = uploadResult.secure_url
            profilePicPublicId = uploadResult.public_id
        }

        // update Fields
        user.firstName = firstName || user.firstName
        user.lastName = lastName || user.lastName
        user.username = username || user.username
        user.address = address || user.address
        user.city = city || user.city
        user.phoneNo = phoneNo || user.phoneNo
        user.role = role || user.role
        user.zipCode = zipCode || user.zipCode
        user.profilePic = profilePicUrl
        user.profilePicPublicId = profilePicPublicId

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Updating user failed",
            error: error.message
        })
    }
}

export const toggleSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isSubscribed = !user.isSubscribed; // Toggle logic (subscribe/unsubscribe)
        await user.save();

        res.status(200).json({
            success: true,
            message: user.isSubscribed ? "Subscribed successfully" : "Unsubscribed successfully",
            isSubscribed: user.isSubscribed
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
