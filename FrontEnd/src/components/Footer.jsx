import React, { useEffect, useState } from 'react'
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin
} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setProducts } from '@/ReduxToolkit/productSlice';
import axios from 'axios';
import { setUser } from '@/ReduxToolkit/userSlice';
import { Button } from './ui/button';

const Footer = () => {
    const [loading, setLoading] = useState()
    const dispatch = useDispatch()
    const { products } = useSelector(store => store.product)
    const { user } = useSelector(store => store.user)
    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const res = await axios.get(`https://electromart-backend-five.vercel.app/api/v1/products/getAllProducts`)
                if (res.data.success) {
                    dispatch(setProducts(res.data.products))
                }
            } catch (error) {
                console.log(error)
                toast.error("Failed to load products")
            }
        }
        getAllProducts();
    }, [])

    const handleSubscription = async () => {
        if (!user || !user._id) {
            return toast.error("User not found. Please login again.");
        }

        try {
            setLoading(true);
            const res = await axios.put(
                `https://electromart-backend-five.vercel.app/api/v1/user/subscription/${user._id}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                const updatedUser = { ...user, isSubscribed: res.data.isSubscribed };
                dispatch(setUser(updatedUser));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();
    const categories = products?.length > 0
        ? [
            ...new Set(
                products
                    .map(p => {
                        let cat = p.category?.trim().toLowerCase();
                        if (!cat) return null;

                        // Sabko plural (s/es) mein convert karne ka logic taake duplicates merge ho jayein
                        if (!cat.endsWith('s')) {
                            if (cat.endsWith('ch') || cat.endsWith('sh')) {
                                cat += 'es'; // Watch -> Watches
                            } else {
                                cat += 's'; // Mobile -> Mobiles
                            }
                        }
                        return cat;
                    })
                    .filter(cat => cat !== null && cat !== "all") // "All" aur null ko yahan nikal diya
            )
        ]
        : [];
    return (
        <footer className="bg-[linear-gradient(to_bottom_right,#111827,#1f2937,#000)] h-max text-white py-14 px-6 lg:px-24">
            <div className="max-w-[1400px] mx-auto">

                {/* Main Footer Wrapper */}
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-4">

                    {/* 1. Company Info */}
                    <div className="flex-1 space-y-6 min-w-[280px]">
                        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            ElectroMart
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Your trusted partner for premium electronics and cutting-edge technology.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone size={16} className="text-blue-500" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail size={16} className="text-blue-500" />
                                <span>support@electromart.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <MapPin size={16} className="text-blue-500" />
                                <span>123 Tech Street, Digital City</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Grouped Links & Categories */}
                    <div className="md:col-span-1 lg:col-span-2 lg:w-[300px] lg:-ml-10 flex flex-row justify-between md:justify-around lg:justify-center lg:gap-20">

                        {/* Quick Links - Right aligned on Laptop */}
                        <div className="flex-1 lg:text-right">
                            <h4 className="text-lg font-semibold mb-6 text-blue-100">Quick Links</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                {["About Us", "Contact", "FAQs", "Returns", "Support", "Shipping Info"].map((link) => (
                                    <li key={link} className="hover:text-white cursor-pointer transition-colors lg:ml-auto w-fit">
                                        {link}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories - Left aligned on Laptop */}
                        <div className="flex-1 text-right md:text-left lg:text-left">
                            <h4 className="text-lg font-semibold mb-6 text-blue-100">Categories</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                {categories.slice(0, 6).map((cat) => (
                                    <li
                                        key={cat}
                                        onClick={() => navigate('/products')} // Aap yahan category filter logic bhi add kar sakte hain
                                        className="hover:text-white cursor-pointer transition-colors w-fit ml-auto md:ml-0 capitalize"
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                    {/* 3. Newsletter & Socials */}
                    <div className="flex-1 w-75 space-y-6 lg:max-w-sm ml-0 lg:ml-12">
                        <h4 className="text-lg font-semibold">
                            {user?.isSubscribed ? "Newsletter Active" : "Stay Updated"}
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {user?.isSubscribed
                                ? "You are successfully subscribed to our newsletter! Enjoy exclusive updates."
                                : "Subscribe to get special offers, free giveaways, and exclusive deals."}
                        </p>
                        <div className="space-y-3">
                            {!user?.isSubscribed && (
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    readOnly
                                    placeholder="Enter your email"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            )}
                            <Button
                                onClick={handleSubscription}
                                disabled={loading}
                                className={`cursor-pointer w-full font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95 ${user?.isSubscribed
                                        ? "bg-gray-800 text-gray-400 border border-gray-700"
                                        : "bg-[linear-gradient(to_right,#2563eb,#9333ea)] text-white"
                                    }`}
                            >
                                {loading ? "Processing..." : (user?.isSubscribed ? "Unsubscribe" : "Subscribe")}
                            </Button>
                        </div>

                        {/* Social Icons matching the layout alignment */}
                        <div className="grid grid-cols-4 w-full pt-4">
                            <div className="flex justify-start">
                                <Facebook size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            </div>
                            <div className="flex justify-center">
                                <Twitter size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            </div>
                            <div className="flex justify-center">
                                <Instagram size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            </div>
                            <div className="flex justify-end">
                                <Youtube size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500">
                    <p>© 2024 ElectroMart. All rights reserved.</p>
                    <div className="flex items-center gap-8 uppercase tracking-wider">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
