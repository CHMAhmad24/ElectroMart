import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { addAddress, deleteAddress, setSelectedAddress } from '@/ReduxToolkit/productSlice'
import { Label } from '@/components/ui/label' // Label fix
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCart } from "@/ReduxToolkit/productSlice"
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2, ShoppingCart, Trash2, MapPin, Plus } from 'lucide-react'

const AddressForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const accessToken = localStorage.getItem("accessToken")

    const [formData, setFormData] = useState({
        fullName: "", phone: "", email: "", address: "",
        city: "", state: "", zip: "", country: "",
    })

    const { cart, addresses, selectedAddress } = useSelector((store) => store.product)
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = () => {
        if (!formData.fullName || !formData.address || !formData.city) {
            return toast.error("Please fill required fields");
        }
        dispatch(addAddress(formData))
        setShowForm(false)
        setFormData({ fullName: "", phone: "", email: "", address: "", city: "", state: "", zip: "", country: "" })
    }

    const subtotal = cart?.totalPrice || 0
    const shipping = subtotal > 50 ? 0 : 1
    const tax = parseFloat((subtotal * 0.05).toFixed(2))
    const total = subtotal + shipping + tax

    const handlePlaceOrder = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            if (selectedAddress === null || !addresses[selectedAddress]) {
                toast.error("Please select or add an address first");
                return;
            }
            if (!cart.items || cart.items.length === 0) {
                toast.error("Cart is empty");
                return;
            }

            const orderData = {
                address: addresses[selectedAddress],
                products: cart.items.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity || 1
                })),
                amount: total,
                tax: tax,
                shipping: shipping
            };

            const response = await axios.post("https://electromart-backend-five.vercel.app/api/v1/order/place", orderData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (response.data.success) {
                toast.success("Order placed successfully!");
                dispatch(setCart({ items: [], totalPrice: 0 }));
                navigate("/order-success");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>Checkout</h1>
                <div className='flex flex-col lg:flex-row gap-8 items-start'>
                    <div className='w-full lg:flex-1'>
                        <Card className="shadow-sm border-none sm:border-solid">
                            <CardHeader className="border-b bg-white">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    Shipping Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='p-4 sm:p-6'>
                                {showForm ? (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input name='fullName' placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone Number</Label>
                                            <Input name='phone' placeholder="+92 3xx xxxxxxx" value={formData.phone} onChange={handleChange} />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Email Address</Label>
                                            <Input name='email' type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Street Address</Label>
                                            <Input name='address' placeholder="House #, Street, Area" value={formData.address} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>City</Label>
                                            <Input name='city' placeholder="Lahore" value={formData.city} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>State / Province</Label>
                                            <Input name='state' placeholder="Punjab" value={formData.state} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Zip Code</Label>
                                            <Input name='zip' placeholder="54000" value={formData.zip} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Country</Label>
                                            <Input name='country' placeholder="Pakistan" value={formData.country} onChange={handleChange} />
                                        </div>
                                        <div className='md:col-span-2 flex gap-3 pt-4'>
                                            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer">Save Address</Button>
                                            {addresses?.length > 0 && <Button variant="outline" className='cursor-pointer' onClick={() => setShowForm(false)}>Cancel</Button>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            {addresses.map((addr, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => dispatch(setSelectedAddress(index))}
                                                    className={`group border p-4 rounded-xl cursor-pointer transition-all relative ${selectedAddress === index ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" : "border-gray-200 hover:border-blue-300"}`}
                                                >
                                                    <div className='pr-8'>
                                                        <p className='font-bold text-gray-900'>{addr.fullName}</p>
                                                        <p className='text-sm text-gray-600 mt-1'>{addr.phone}</p>
                                                        <p className='text-sm text-gray-500 line-clamp-2 mt-1'>
                                                            {addr.address}, {addr.city}, {addr.state}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); dispatch(deleteAddress(index)); }}
                                                        className='absolute top-3 right-3 p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer'
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant='outline' className='w-full border-dashed border-2 py-6 cursor-pointer' onClick={() => setShowForm(true)}>
                                            <Plus className="w-4 h-4 mr-2" /> Add New Address
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className='w-full lg:w-[400px] lg:sticky lg:top-28'>
                        <Card className="shadow-sm">
                            <CardHeader className="bg-gray-50/50">
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className='p-6 space-y-4'>
                                <div className='flex justify-between text-gray-600'>
                                    <span>Subtotal ({cart?.items?.length || 0} items)</span>
                                    <span>$ {subtotal.toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between text-gray-600'>
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                                        {shipping === 0 ? "Free" : `$ ${shipping}`}
                                    </span>
                                </div>
                                <div className='flex justify-between text-gray-600'>
                                    <span>Tax (5%)</span>
                                    <span>$ {tax.toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className='flex justify-between font-bold text-xl text-gray-900'>
                                    <span>Total</span>
                                    <span>$ {total.toLocaleString()}</span>
                                </div>

                                <Button 
                                    disabled={selectedAddress === null || loading || showForm} 
                                    onClick={handlePlaceOrder} 
                                    className='w-full bg-blue-600 hover:bg-blue-700 py-6 mt-4 text-lg font-semibold rounded-xl cursor-pointer'
                                >
                                    {loading ? (
                                        <><Loader2 className='h-5 w-5 animate-spin mr-2' /> Processing...</>
                                    ) : (
                                        <><ShoppingCart className="mr-2 h-5 w-5" /> Place Order</>
                                    )}
                                </Button>
                                
                                <p className='text-[12px] text-center text-gray-600 mt-4'>
                                    By placing your order, you agree to our Terms of Services.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddressForm;
