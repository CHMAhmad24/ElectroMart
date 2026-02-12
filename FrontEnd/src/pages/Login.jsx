import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Google from "../Assets/Google.png"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/ReduxToolkit/userSlice'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!formData.email) {
        return toast.error("Email is required");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return toast.error("Please enter a valid email address");
      }
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/login`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.data.success) {
        navigate('/');
        dispatch(setUser(res.data.user));
        localStorage.setItem('accessToken', res.data.accessToken);
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log("Error during login:", error);
      toast.error(error.response.data.message || "Login failed");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex justify-center items-center h-full w-full bg-white'>
      <Card className="w-full max-w-sm border-none shadow-none text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials below to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className='grid gap-2'>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" title='Forgot Password?' className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className='relative'>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  required />
                {
                  showPassword ?
                    <EyeOff
                      className='w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer'
                      onClick={() => setShowPassword(false)} /> :
                    <Eye
                      className='w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer'
                      onClick={() => setShowPassword(true)} />
                }
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button disabled={loading} type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-800" onClick={submitHandler}>
            {loading ? <> <Loader2 className='h-4 w-4 animate-spin mr-2' /> Please wait </> : "Login"}
          </Button>
          <Button disabled={loading} onClick={() => window.open("https://electromart-backend-five.vercel.app/api/v1/auth/google", "_self")} variant='outline' className='w-full cursor-pointer' >
            <img src={Google} alt="" className='w-5' />
            Login With Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
