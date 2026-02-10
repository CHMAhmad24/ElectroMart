import React, { useState, useRef } from 'react'; // useRef add kiya
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    
    // OTP ko array mein rakhenge (6 boxes ke liye)
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]); // Har box ke focus ko control karne ke liye

    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const BASE_URL = "https://electromart-backend-five.vercel.app/api/v1/user";

    // OTP Input logic
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Agle box par move karo agar value enter ho gayi hai
        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Backspace dabane par pichle box par jao
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const data = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(data)) return;

        const newOtp = [...otp];
        data.split("").forEach((char, index) => {
            newOtp[index] = char;
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
        setOtp(newOtp);
        // Last filled box par focus karo
        if (inputRefs.current[data.length - 1]) {
            inputRefs.current[data.length - 1].focus();
        }
    };

    // Step 1: Send OTP
    const handleSendOTP = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return toast.error("Email is required");
        if (!emailRegex.test(email)) return toast.error("Please enter a valid email address");

        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}/forgotPassword`, { email });
            if (res.data.success) {
                toast.success(res.data.message);
                setStep(2);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async () => {
        const otpString = otp.join(""); // Array ko wapis string banaya
        if (otpString.length < 6) return toast.error("Please enter full OTP");

        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}/verifyOTP/${email}`, { otp: otpString });
            if (res.data.success) {
                toast.success(res.data.message);
                setStep(3);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Change Password (No changes needed here)
    const handleChangePassword = async () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwords.newPassword || !passwords.confirmPassword) return toast.error("Please fill in all password fields");
        if (!passwordRegex.test(passwords.newPassword)) return toast.error("Password too weak!");
        if (passwords.newPassword !== passwords.confirmPassword) return toast.error("Passwords do not match!");

        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}/changePassword/${email}`, passwords);
            if (res.data.success) {
                toast.success("Password updated! Please login.");
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-gray-50'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}</CardTitle>
                    <CardDescription>
                        {step === 1 && "Enter your email to receive a code."}
                        {step === 2 && `Code sent to ${email}`}
                        {step === 3 && "Create a strong new password."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    {step === 1 && (
                        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                    )}

                    {step === 2 && (
                        <div className="flex justify-between gap-2" onPaste={handlePaste}>
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="w-12 h-12 text-center text-xl font-bold border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={data}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onChange={(e) => handleOtpChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-3">
                            {/* ... same password inputs as before ... */}
                            <div className="relative">
                                <Input
                                    placeholder="New Password"
                                    type={showPassword ? "text" : "password"}
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                />
                                <div className="absolute right-3 top-2.5 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                            <div className='relative'>
                                <Input
                                    placeholder="Confirm Password"
                                    type={showPassword ? "text" : "password"}
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                />
                                <div className="absolute right-3 top-2.5 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                        </div>
                    )}

                    <Button className="w-full bg-blue-600 cursor-pointer" disabled={loading} onClick={
                        step === 1 ? handleSendOTP : step === 2 ? handleVerifyOTP : handleChangePassword
                    }>
                        {loading ? <Loader2 className="animate-spin" /> : "Continue"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
