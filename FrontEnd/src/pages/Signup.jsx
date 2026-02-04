import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
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

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            return toast.error("All fields are required");
        }

        if (!emailRegex.test(formData.email)) {
            return toast.error("Please enter a valid email address");
        }

        if (!passwordRegex.test(formData.password)) {
            return toast.error(
                "Password must be 8+ chars, including uppercase, lowercase, number and special character"
            );
        }

        try {
            setLoading(true);
            const res = await axios.post(`https://electromart-backend-five.vercel.app/api/v1/user/register`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.data.success) {
                console.log("Signup successful:", res.data.message);
                navigate('/verify');
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log("Error during signup:", error);
            toast.error(error.response.data.message || "Signup failed");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className='flex justify-center items-center h-full w-full bg-white'>
            <Card className="w-full max-w-sm border-none shadow-none text-center">
                <CardHeader className="text-4xl font-bold">
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className='grid gap-2'>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="John" required />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Doe" required />
                            </div>
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className='relative'>
                                <Input
                                    id="password"
                                    placeholder="Create a password"
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
                        {loading ? <> <Loader2 className='h-4 w-4 animate-spin mr-2' /> Please wait </> : "Sign Up"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Signup