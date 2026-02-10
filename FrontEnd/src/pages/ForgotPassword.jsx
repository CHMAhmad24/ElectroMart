import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const navigate = useNavigate();

  const BASE_URL = "https://electromart-backend-five.vercel.app/api/v1/user";

  // Step 1: Send OTP
  const handleSendOTP = async () => {
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
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/verifyOTP/${email}`, { otp });
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

  // Step 3: Change Password
  const handleChangePassword = async () => {
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
            <Input placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
          )}

          {step === 3 && (
            <>
              <Input 
                placeholder="New Password" 
                type="password" 
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
              />
              <Input 
                placeholder="Confirm Password" 
                type="password" 
                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} 
              />
            </>
          )}

          <Button className="w-full bg-blue-600" disabled={loading} onClick={
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
