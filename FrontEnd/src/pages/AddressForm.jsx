import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { addAddress, deleteAddress, setSelectedAddress } from '@/ReduxToolkit/productSlice'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCart } from "@/ReduxToolkit/productSlice"
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2, ShoppingCart, Trash2, MapPin, Plus } from 'lucide-react'
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddressForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const accessToken = localStorage.getItem("accessToken")

    const { cart, addresses, selectedAddress } = useSelector((store) => store.product)
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)

    const [formData, setFormData] = useState({
        fullName: "", phone: "", email: "", address: "",
        city: "", state: "", zip: "",
    })

    // --- ADDRESS FETCH AUR DYNAMIC STORAGE SYNC ---
    useEffect(() => {
        let isMounted = true;

        const fetchUserAddress = async () => {
            try {
                setLoading(true);
                if (!accessToken) return;

                // Decode User ID to create a unique locker key for this specific user
                const decoded = jwtDecode(accessToken);
                const userId = decoded.id;
                const userSpecificKey = `checkout_addresses_${userId}`;

                // STEP 1: Pehle check karo kya is user ke saved addresses browser memory me hain?
                const savedLocalAddresses = localStorage.getItem(userSpecificKey);
                if (savedLocalAddresses) {
                    const parsedLocal = JSON.parse(savedLocalAddresses);
                    if (parsedLocal && parsedLocal.length > 0) {
                        // Agar store bilkul empty hai toh hi fill karein taaki duplicate na ho
                        if (addresses.length === 0) {
                            parsedLocal.forEach(addr => dispatch(addAddress(addr)));
                            dispatch(setSelectedAddress(0));
                            setShowForm(false);
                        }
                        setLoading(false);
                        return; // API hit karne ki zaroorat nahi padi
                    }
                }

                // STEP 2: Agar local memory khali hai, toh Backend se profile data fetch karo
                const response = await axios.get(`${BACKEND_URL}/api/v1/user/getUserById/${userId}`);

                if (isMounted && response.data.success && response.data.user) {
                    const user = response.data.user;

                    if (user.address && user.address.trim() !== "") {
                        const parsedAddress = {
                            fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                            phone: user.phoneNo || "",
                            email: user.email || "",
                            address: user.address,
                            city: user.city || "",
                            state: user.state || "",
                            zip: user.zipCode || "",
                            isFromDB: true
                        };

                        if (addresses.length === 0) {
                            dispatch(addAddress(parsedAddress));
                            dispatch(setSelectedAddress(0));
                            setShowForm(false);

                            // Is user ki unique key ke andar lock kardo
                            localStorage.setItem(userSpecificKey, JSON.stringify([parsedAddress]));
                        }
                    }
                }
            } catch (error) {
                console.error("Address fetch error:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (addresses.length === 0) {
            fetchUserAddress();
        }

        return () => {
            isMounted = false;
        };
    }, [accessToken, dispatch, addresses.length]); // Sync trigger balanced


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // --- NEW ADDRESS SAVE LOGIC (DYNAMIC LOCK) ---
    const handleSave = async () => {
        if (!formData.fullName) return toast.error("Full Name is required");
        if (!formData.phone) return toast.error("Phone no is required");
        if (!formData.email) return toast.error("Email is required");
        if (!formData.address) return toast.error("Address is required");
        if (!formData.city) return toast.error("City is required");
        if (!formData.zip) return toast.error("Zip code is required");
        if (!formData.state) return toast.error("State is required");

        try {
            setLoading(true);
            const decoded = jwtDecode(accessToken);
            const userId = decoded.id;
            const userSpecificKey = `checkout_addresses_${userId}`;

            const hasDBAddress = addresses.some(addr => addr.isFromDB === true);
            let addressToSave = { ...formData };

            if (!hasDBAddress) {
                // CASE 1: Agar user ka core profile address save nahi tha, toh database update karo
                const profilePayload = {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zip,
                    phoneNo: formData.phone
                };

                await axios.put(`${BACKEND_URL}/api/v1/user/update/${userId}`, profilePayload, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                addressToSave.isFromDB = true;
                toast.success("Address saved to database profile!");
            } else {
                // CASE 2: DB address already exists -> save locally for this user session
                addressToSave.isFromDB = false;
                toast.success("New checkout address added!");
            }

            // --- REDUX + DYNAMIC PERSIST SYNC ---
            dispatch(addAddress(addressToSave));

            const existingLocal = localStorage.getItem(userSpecificKey);
            const currentLocalArray = existingLocal ? JSON.parse(existingLocal) : [];

            // Prevent UI duplications
            const isDuplicate = currentLocalArray.some(a => a.address === addressToSave.address && a.fullName === addressToSave.fullName);

            if (!isDuplicate) {
                const updatedLocalArray = [...currentLocalArray, addressToSave];
                localStorage.setItem(userSpecificKey, JSON.stringify(updatedLocalArray));
            }

            dispatch(setSelectedAddress(addresses.length));
            setShowForm(false);
            setFormData({ fullName: "", phone: "", email: "", address: "", city: "", state: "", zip: "" });

        } catch (error) {
            console.error("Save profile error:", error);
            toast.error(error.response?.data?.message || "Profile update failed");
        } finally {
            setLoading(false);
        }
    };

    // --- TRASH / DELETE SYNC FOR LOCALSTORAGE ---
    const handleDeleteAddress = (indexToDelete) => {
        // 1. Redux store state clean
        dispatch(deleteAddress(indexToDelete));

        // 2. Local storage clean matching the current user key
        if (accessToken) {
            const decoded = jwtDecode(accessToken);
            const userId = decoded.id;
            const userSpecificKey = `checkout_addresses_${userId}`;

            const existingLocal = localStorage.getItem(userSpecificKey);
            if (existingLocal) {
                const currentLocalArray = JSON.parse(existingLocal);
                const updatedLocalArray = currentLocalArray.filter((_, index) => index !== indexToDelete);
                localStorage.setItem(userSpecificKey, JSON.stringify(updatedLocalArray));
            }
        }
        toast.success("Address removed successfully");
    };

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

            const currentAddr = addresses[selectedAddress];

            const orderData = {
                address: {
                    fullName: currentAddr.fullName,
                    phoneNo: currentAddr.phone,
                    email: currentAddr.email,
                    streetAddress: currentAddr.address,
                    city: currentAddr.city,
                    state: currentAddr.state,
                    zipCode: currentAddr.zip
                },
                products: cart.items.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity || 1
                })),
                amount: total,
                tax: tax,
                shipping: shipping,
                date: Date.now()
            };

            const response = await axios.post(`${BACKEND_URL}/api/v1/order/place`, orderData, {
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
                                        <div className='md:col-span-2 flex gap-3 pt-4'>
                                            <Button disabled={loading} onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Address"}
                                            </Button>
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
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteAddress(index); }}
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