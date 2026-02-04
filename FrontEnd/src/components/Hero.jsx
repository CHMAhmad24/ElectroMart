import React from 'react'
import { Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate()
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-100 px-6 py-16 md:px-12 lg:px-24 max-w-[1600px] mx-auto flex items-center mt-12">

            {/* Background Mesh Gradient */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-blue-50 to-white opacity-70"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

                {/* Left Content */}
                <div className="flex flex-col z-10 items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
                    <div>
                        {/* Badge */}
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold text-white bg-[linear-gradient(to_right,#2563eb,#9333ea)] mb-6 shadow-md">
                            <Zap className="mr-2 w-4 h-4 fill-yellow-300 text-yellow-300" />
                            Flash Sale - 50% OFF
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700">
                                Premium Electronics
                            </span>
                            <br className="hidden sm:block" />
                            <span className="text-gray-800"> For Modern Life</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-gray-500 max-w-lg leading-relaxed mb-8">
                            Discover cutting-edge technology with unmatched quality. From smartphones to smart homes, we bring you the future today.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                        <button onClick={() => navigate('/products')} className="inline-flex items-center justify-center cursor-pointer px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 bg-[linear-gradient(to_right,#2563eb,#9333ea)] shadow-lg">
                            Shop Now
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </button>

                        <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl cursor-pointer font-bold text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm">
                            Explore Deals
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-10 border-t border-gray-100 pt-8 w-full">
                        <div className="text-center lg:text-left">
                            <div className="text-xl sm:text-2xl font-black text-gray-900">50K+</div>
                            <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-gray-400 font-mono">Customers</div>
                        </div>
                        <div className="text-center lg:text-left">
                            <div className="text-xl sm:text-2xl font-black text-gray-900">10K+</div>
                            <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-gray-400 font-mono">Products</div>
                        </div>
                        <div className="text-center lg:text-left">
                            <div className="text-xl sm:text-2xl font-black text-gray-900">99.9%</div>
                            <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-gray-400 font-mono">Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Right Image Section */}
                <div className="relative group order-1 lg:order-2 flex justify-center items-center">
                    <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-[1.5rem] -rotate-3 scale-102 opacity-20 transition-all duration-400 ease-in-out group-hover:rotate-3 group-hover:scale-102 blur-[1px]"></div>
                    <div className="relative bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-[1.5rem] shadow-2xl border border-white/50 max-w-[85%] sm:max-w-[75%] lg:max-w-full transition-all duration-1000 ease-in-out group-hover:shadow-blue-200/50">
                        <img
                            onClick={() => navigate('/products')}
                            src="https://images.unsplash.com/photo-1727093493864-0bcbd16c7e6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                            alt="Premium Electronics"
                            className="w-full h-auto rounded-[1.5rem] object-cover cursor-pointer"
                        />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Hero