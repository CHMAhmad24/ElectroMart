import React from 'react'
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, Calendar, ShoppingCart, ChevronRight } from "lucide-react";

const OrderCard = ({ userOrder, loading }) => {
    const navigate = useNavigate();    

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 animate-pulse font-medium">Fetching orders...</p>
        </div>
    );

    return (
        <div className='w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 md:py-8'>
            <div className='w-full'>
                <h1 className="text-xl md:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Purchase History</h1>

                {userOrder?.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <p className='text-gray-500 text-lg font-medium'>No orders found.</p>
                        <Button onClick={() => navigate('/products')} className="mt-6 bg-blue-600 rounded-xl px-8">
                            Browse Products
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {userOrder?.map((order) => (
                            <div key={order._id} className="w-full bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden border border-gray-200">
                                
                                {/* Order Header: Status & ID */}
                                <div className="bg-gray-50/80 p-4 md:px-6 flex flex-wrap justify-between items-center gap-3 border-b">
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-bold text-gray-400 uppercase'>Order Reference</span>
                                        <h2 className="text-sm font-mono font-bold text-blue-600">#{order._id}</h2>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <div className='hidden md:flex items-center text-gray-500 text-xs'>
                                            <Calendar size={14} className='mr-1' />
                                            {new Date(order.date).toLocaleDateString()}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                            ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Body: Product List */}
                                <div className="p-4 md:p-6">
                                    <div className='flex items-center gap-2 mb-4'>
                                        <ShoppingCart size={16} className='text-gray-400'/>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordered Items</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {order.products?.map((product, index) => (
                                            /* LAYOUT LOGIC:
                                               - Mobile: flex-col (Column View)
                                               - Tablet/Laptop (sm+): flex-row (Row View)
                                            */
                                            <div key={index} className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 group">
                                                
                                                {/* Product Image */}
                                                <div className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-white border">
                                                    <img
                                                        src={product.productId?.productImg?.[0]?.url || "placeholder-url"}
                                                        alt="product"
                                                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                                                    />
                                                </div>

                                                {/* Product Details - Stays Row on Laptop, Stacks on Mobile */}
                                                <div className="flex-1 w-full text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className='flex-1 min-w-0'>
                                                        <h4 className="font-bold text-gray-800 text-base line-clamp-1">
                                                            {product.productId?.productName}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Category: <span className='text-gray-700 font-medium'>{product.productId?.category || 'General'}</span>
                                                        </p>
                                                    </div>

                                                    <div className='flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0'>
                                                        <span className='text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md'>
                                                            Qty: {product.quantity}
                                                        </span>
                                                        <p className="font-bold text-gray-900">
                                                            {order.currency} {(product.productId?.productPrice * product.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer: Shipping & Total */}
                                <div className="bg-gray-50/30 p-4 md:p-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex gap-3 items-start">
                                        <div className="p-2 bg-white rounded-lg border shadow-sm flex-shrink-0">
                                            <MapPin size={18} className="text-blue-600" />
                                        </div>
                                        <div className='min-w-0'>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Deliver To</p>
                                            <p className="text-sm font-bold text-gray-800 truncate">
                                                {order.address?.firstName} {order.address?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-1 italic">
                                                {order.address?.address}, {order.address?.city}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center md:justify-end gap-6 bg-blue-600 p-4 rounded-xl text-white">
                                        <div className='text-left md:text-right'>
                                            <p className="text-[10px] font-bold text-blue-100 uppercase">Grand Total</p>
                                            <p className="text-2xl font-black">
                                                <span className='text-2xl align-top mr-1'>{order.currency}</span>
                                                {order.amount?.toLocaleString()}
                                            </p>
                                        </div>
                                        <ChevronRight className='opacity-50' />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderCard