import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import userpng from '../Assets/User-png.webp'
import { toast } from 'sonner'
import { setUser } from '@/ReduxToolkit/userSlice'
import axios from 'axios'
import { Loader2, User, Package, Camera } from 'lucide-react'
import MyOrders from '@/components/MyOrders'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
    const { user } = useSelector(store => store.user)
    const params = useParams()
    const dispatch = useDispatch()

    const userId = params.Id || user?._id || user?.id;

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const [updateUser, setUpdateUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNo: "",
        address: "",
        city: "",
        zipCode: "",
        profilePic: "",
        avatar: "",
        role: "",
    })

    const displayavatar = file
        ? URL.createObjectURL(file)
        : (updateUser?.profilePic || updateUser?.avatar || userpng);

    useEffect(() => {
        if (user) {
            setUpdateUser({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                username: user.username || "",
                email: user.email || "",
                phoneNo: user.phoneNo || "",
                address: user.address || "",
                city: user.city || "",
                zipCode: user.zipCode || "",
                profilePic: user.profilePic || "",
                avatar: user.avatar || "",
                role: user.role || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = {
            firstName: "First Name",
            lastName: "Last Name",
            username: "Username",
            phoneNo: "Phone Number",
            address: "Address",
            city: "City",
            zipCode: "Zip Code"
        };

        for (const [key, label] of Object.entries(requiredFields)) {
            if (user?.username && user.username !== "undefined") {
                if (key === 'firstName' || key === 'lastName') continue;
            } else {
                if (key === 'username') continue;
            }

            if (!updateUser[key] || updateUser[key].trim() === "") {
                return toast.error(`${label} cannot be empty!`);
            }
        }

        if (!userId || userId === "undefined") {
            return toast.error("User ID missing. Please login again.");
        }

        const accessToken = localStorage.getItem("accessToken");
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("firstName", updateUser.firstName);
            formData.append("lastName", updateUser.lastName);
            formData.append("username", updateUser.username);
            formData.append("email", updateUser.email);
            formData.append("phoneNo", updateUser.phoneNo);
            formData.append("address", updateUser.address);
            formData.append("city", updateUser.city);
            formData.append("zipCode", updateUser.zipCode);

            if (file) {
                formData.append("file", file);
            }

            const res = await axios.put(`${BACKEND_URL}/api/v1/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setUser(res.data.user));
                setFile(null);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed To Update Profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='pt-28 pb-10 min-h-screen bg-gray-50 px-4'>
            <div className='max-w-4xl lg:max-w-6xl mx-auto'>
                <Tabs defaultValue="profile" className='w-full'>
                    <TabsList className="grid w-full h-14 -mt-5 grid-cols-2 mb-8 bg-gray-200/50 border p-1 rounded-xl">
                        <TabsTrigger
                            value="profile"
                            className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all cursor-pointer"
                        >
                            <User size={18} />
                            <span className="font-semibold text-sm md:text-base">My Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="orders"
                            className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all cursor-pointer"
                        >
                            <Package size={18} />
                            <span className="font-semibold text-sm md:text-base">My Orders</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <div className='bg-white shadow-sm border rounded-2xl p-6 md:p-10'>
                            <div className='flex flex-col lg:flex-row gap-12'>
                                <div className='flex flex-col items-center space-y-4'>
                                    <div className='relative group'>
                                        <img
                                            src={displayavatar}
                                            alt="Profile"
                                            className='w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-blue-50 shadow-xl'
                                        />
                                        <label className='absolute bottom-2 right-2 bg-blue-600 p-2.5 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-lg transition-transform hover:scale-110'>
                                            <Camera size={20} />
                                            <input type="file" accept='image/*' onChange={handleFileChange} className='hidden' />
                                        </label>
                                    </div>
                                    <div className='text-center'>
                                        <h2 className='font-bold text-xl text-gray-800 uppercase tracking-tight'>
                                            {user?.username && user.username !== "undefined"
                                                ? user.username
                                                : (user?.firstName && user.firstName !== "undefined"
                                                    ? `${user.firstName} ${user.lastName || ''}`
                                                    : 'User')
                                            }
                                        </h2>
                                        <p className='text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 inline-block uppercase'>
                                            {user?.role || 'Customer'}
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className='flex-1 space-y-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                        {user?.username && user.username !== "undefined" ? (
                                            <div className='md:col-span-2 space-y-2'>
                                                <Label className="text-gray-600 font-semibold">Username</Label>
                                                <Input name='username' value={updateUser.username} onChange={handleChange} className="focus-visible:ring-blue-500 bg-gray-50/50" />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <Label className="text-gray-600 font-semibold">First Name</Label>
                                                    <Input name='firstName' value={updateUser.firstName} onChange={handleChange} className="bg-gray-50/50" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-gray-600 font-semibold">Last Name</Label>
                                                    <Input name='lastName' value={updateUser.lastName} onChange={handleChange} className="bg-gray-50/50" />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-600 font-semibold">Email Address</Label>
                                        <Input value={updateUser.email} disabled className='bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-600 font-semibold">Phone Number</Label>
                                        <Input name='phoneNo' type="tel" value={updateUser.phoneNo} onChange={handleChange} placeholder="Enter phone" className="bg-gray-50/50" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-600 font-semibold">Street Address</Label>
                                        <Input name='address' value={updateUser.address} onChange={handleChange} placeholder="House #, Street..." className="bg-gray-50/50" />
                                    </div>

                                    <div className='grid grid-cols-2 gap-5'>
                                        <div className="space-y-2">
                                            <Label className="text-gray-600 font-semibold">City</Label>
                                            <Input name='city' value={updateUser.city} onChange={handleChange} className="bg-gray-50/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-600 font-semibold">Zip Code</Label>
                                            <Input name='zipCode' value={updateUser.zipCode} onChange={handleChange} className="bg-gray-50/50" />
                                        </div>
                                    </div>

                                    <Button
                                        disabled={loading}
                                        type="submit"
                                        className='w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-bold rounded-xl shadow-lg shadow-blue-100 mt-4 cursor-pointer transition-all active:scale-[0.98]'
                                    >
                                        {loading ? <><Loader2 className='h-5 w-5 animate-spin mr-2' /> Updating...</> : "Save Changes"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders">
                        <div className="bg-white rounded-2xl shadow-sm border pt-14 min-h-100">
                            <MyOrders />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Profile