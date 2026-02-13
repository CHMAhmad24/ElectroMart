import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '@/ReduxToolkit/userSlice';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Google from "../Assets/Google.png"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState('authenticating'); // 'authenticating' | 'success' | 'error'

    useEffect(() => {
        const handleAuth = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get("token");

            if (!token) {
                setStatus('error');
                toast.error("Authentication failed: No token received");
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            try {
                // 1. Save token immediately
                localStorage.setItem("accessToken", token);
                
                // 2. Set global axios header for this and future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // 3. Fetch user profile
                const res = await axios.get(`${BACKEND_URL}/api/v1/auth/me`);

                if (res.data.success) {
                    dispatch(setUser(res.data.user));
                    setStatus('success');
                    toast.success(`Welcome back, ${res.data.user.firstName || 'User'}!`);
                    
                    // Small delay to let the user see the "Success" state
                    setTimeout(() => navigate("/"), 1500);
                }
            } catch (error) {
                console.error("Auth Success Error:", error);
                setStatus('error');
                localStorage.removeItem("accessToken");
                toast.error(error.response?.data?.message || "Failed to sync profile");
                setTimeout(() => navigate("/login"), 3000);
            }
        };

        handleAuth();
    }, [navigate, dispatch, location]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full mx-4"
            >
                {status === 'authenticating' && (
                    <>
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800">Verifying Session</h2>
                        <p className="text-gray-500 text-center mt-2">Completing your secure login, please wait...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                        </motion.div>
                        <h2 className="text-xl font-semibold text-gray-800">Login Successful!</h2>
                        <p className="text-gray-500 text-center mt-2">Redirecting you to the dashboard...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800">Authentication Error</h2>
                        <p className="text-gray-500 text-center mt-2">We couldn't log you in. Redirecting to login page...</p>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default AuthSuccess;