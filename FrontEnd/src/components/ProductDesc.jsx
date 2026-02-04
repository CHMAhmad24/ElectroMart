import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ChevronDown, ChevronUp, Loader2, ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '@/ReduxToolkit/productSlice'

const ProductDesc = ({ product }) => {
    const [loading, setLoading] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const dispatch = useDispatch()
    const [isExpanded, setIsExpanded] = useState(false)
    const accessToken = localStorage.getItem("accessToken")
    const isLongDescription = product.productDesc?.length > 200;
    const addToCart = async (productId) => {
        try {
            setLoading(true)
            const res = await axios.post(`https://electromart-backend-five.vercel.app/api/v1/cart/add`, { productId, quantity }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success("Product Added To Cart")
                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>
            <p>{product.category} | {product.brand}</p>
            <h2 className='text-blue-500 font-bold text-2xl'>$ {product.productPrice}</h2>
            {/* Description Section */}
            <div className='relative'>
                <p className={`text-muted-foreground transition-all duration-300 ${!isExpanded ? 'line-clamp-5' : ''}`}>
                    {product.productDesc}
                </p>
                {isLongDescription && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className='text-blue-600 hover:text-blue-800 font-semibold text-sm mt-1 flex items-center gap-1 cursor-pointer'
                    >
                        {isExpanded ? (
                            <>Show Less <ChevronUp className='w-4 h-4' /></>
                        ) : (
                            <>See More <ChevronDown className='w-4 h-4' /></>
                        )}
                    </button>
                )}
            </div>
            <div className='flex flex-col gap-3'>
                <p className='text-gray-800 font-semibold'>Quantity:</p>
                <div className='flex items-center gap-0 w-max border border-gray-300 rounded-lg overflow-hidden shadow-sm'>
                    {/* Minus Button */}
                    <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className='px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border-r border-gray-300 active:bg-gray-200'
                    >
                        <span className='text-xl font-medium'>−</span>
                    </button>

                    {/* Quantity Display/Input */}
                    <input
                        type='number'
                        className='w-16 text-center bg-white outline-none font-semibold text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        value={quantity}
                        min={1}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    />

                    {/* Plus Button */}
                    <button
                        onClick={() => setQuantity(prev => prev + 1)}
                        className='px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border-l border-gray-300 active:bg-gray-200'
                    >
                        <span className='text-xl font-medium'>+</span>
                    </button>
                </div>
            </div>
            <Button disabled={loading} onClick={() => addToCart(product._id)} className='h-15 bg-blue-600 mb-3 w-full cursor-pointer' >
                {loading ? <> <Loader2 className='h-4 w-4 animate-spin mr-2' /> Please wait </> : <><ShoppingCart /> Add to cart </>}
            </Button>
        </div>
    )
}

export default ProductDesc