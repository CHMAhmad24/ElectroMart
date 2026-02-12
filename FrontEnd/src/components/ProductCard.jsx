import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2, ShoppingCart } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCart } from '@/ReduxToolkit/productSlice'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductCard = ({ product, loading }) => {
    const { productImg, productPrice, productName } = product
    const [loadings, setLoadings] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accessToken = localStorage.getItem('accessToken')

    const addToCart = async (productId) => {
        if (!accessToken) {
            toast.error("Please login or register to shop products");
            return navigate('/signup'); 
        }
        try {
            setLoadings(true)
            const res = await axios.post(`${BACKEND_URL}/api/v1/cart/add`, { productId, quantity: 1 }, {
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
            if(error.response?.status === 401) {
            toast.error("Session expired. Please login again.");
            navigate('/signup');
        }
        } finally {
            setLoadings(false)
        }
    }
    return (
        <div className='shadow-lg rounded-lg overflow-hidden h-max '>
            <div className='w-full h-full aspect-square overflow-hidden'>
                {
                    loading ? <Skeleton className='w-full h-full rotate-lg' /> :
                        <img onClick={() => navigate(`/products/${product._id}`)} src={productImg[2]?.url} alt="" className='w-full h-full transition-transform duration-300 hover:scale-105 object-cover' />
                }
            </div>
            {
                loading ?
                    <div className='px-2 space-y-2 my-2'>
                        <Skeleton className='w-[200px] h-4' />
                        <Skeleton className='w-[100px] h-4' />
                        <Skeleton className='w-[150px] h-8' />
                    </div> :
                    <div className='px-2 space-y-1 '>
                        <h1 className='font-semibold h-12 line-clamp-2 '>{productName}</h1>
                        <h2 className='font-bold '>$ {productPrice}</h2>
                        <Button disabled={loadings} onClick={() => addToCart(product._id)} className='bg-blue-600 mb-3 w-full cursor-pointer'>
                            {loadings ? <> <Loader2 className='h-4 w-4 animate-spin mr-2' /> Please wait </> : <><ShoppingCart /> Add to cart </>}
                        </Button>
                    </div>
            }
        </div>
    )
}

export default ProductCard
