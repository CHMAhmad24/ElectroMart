import { setUser } from '@/ReduxToolkit/userSlice'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthSuccess = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      // Duplicate calls ko rokne ke liye
      if (hasFetched.current) return;

      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get("token")

      if (accessToken) {
        hasFetched.current = true;
        localStorage.setItem("accessToken", accessToken);

        try {
          const res = await axios.get(`${BACKEND_URL}/api/v1/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          if (res.data.success) {
            dispatch(setUser(res.data.user));
            // Home page par bhej dein
            navigate("/", { replace: true });
          }
        } catch (error) {
          console.error("Error Fetching User", error);
          localStorage.removeItem("accessToken"); // Clean up on failure
          navigate("/login?error=fetch_failed");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login");
      }
    };

    handleAuth();
  }, [navigate, dispatch]); // 'user' dependency yahan se hata di gayi hai

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        {loading ? (
          <div className="space-y-4">
             {/* Aap yahan koi bhi CSS Spinner daal sakte hain */}
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-lg font-medium text-gray-700">Finalizing login...</p>
          </div>
        ) : (
          <p className="text-red-500">Redirecting...</p>
        )}
      </div>
    </div>
  );
}

export default AuthSuccess;