import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserLogo from '../Assets/User-png.webp'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '@/ReduxToolkit/productSlice'
import { toast } from 'sonner'

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [qtyLoadingId, setQtyLoadingId] = useState(null)
  const [removeLoadingId, setRemoveLoadingId] = useState(null)
  const { cart } = useSelector((store) => store.product)
  const subtotal = cart?.totalPrice
  const shipping = subtotal > 50 ? 0 : 10
  const Tax = subtotal * 0.05 
  const Total = subtotal + shipping + Tax

  const API = "https://electromart-backend-five.vercel.app/api/v1/cart"
  const accessToken = localStorage.getItem("accessToken")

  const handleUpdateQuantity = async (productId, type) => {
    try {
      setQtyLoadingId(productId)

      const res = await axios.put(`${API}/update`, { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setQtyLoadingId(null)
    }
  }

  const handleRemove = async (productId) => {
    try {
      setRemoveLoadingId(productId)
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: { productId }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        toast.success("Product removed from cart")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setRemoveLoadingId(null)
    }
  }

  const loadCart = async () => {
    try {
      const res = await axios.get(`${API}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadCart()
  }, [dispatch])

  return (
    <div className='pt-24 pb-10 bg-gray-50 min-h-screen px-4'>
      {cart?.items?.length > 0 ? (
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-8'>Shopping Cart</h1>

          {/* Main Container: Mobile pe Col, Desktop pe Row */}
          <div className='flex flex-col lg:flex-row gap-8'>

            {/* Products List Section */}
            <div className='flex flex-col gap-4 flex-1 lg:w-[500px]'>
              {cart?.items?.map((product, index) => (
                <Card key={index} className="overflow-hidden mb-4 shadow-sm">
                  <div className='flex flex-col sm:flex-row items-center gap-4 p-4'>

                    {/* Section 1: Image & Title */}
                    <div className='flex items-center gap-4 w-full sm:flex-[2] min-w-0'>
                      <img
                        src={product?.productId?.productImg?.[0].url || UserLogo}
                        alt="product"
                        className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0 border'
                      />

                      <div className='min-w-0 flex-1'>
                        <h1 className='font-semibold text-sm sm:text-base uppercase truncate' title={product?.productId?.productName}>
                          {product?.productId?.productName}
                        </h1>
                        <p className='text-gray-500 text-xs sm:text-sm'>
                          Unit Price: $ {product?.productId?.productPrice?.toLocaleString()}
                        </p>
                        {/* Mobile Only: Total Price (Quantity se pehle chota sa display) */}
                        <p className='text-blue-600 font-bold text-sm sm:hidden mt-1'>
                          Total: $ {(product?.productId?.productPrice * product?.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Section 2: Controls & Individual Total */}
                    <div className='flex items-center justify-between w-full sm:w-auto sm:flex-[1.5] gap-4 sm:gap-6 border-t sm:border-t-0 pt-4 sm:pt-0'>

                      {/* Quantity Controls */}
                      <div className='flex items-center gap-2 bg-gray-100 rounded-lg p-1 flex-shrink-0'>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-white transition-colors cursor-pointer"
                          onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')}
                        > - </Button>
                        <span className='w-6 text-center font-medium text-sm'>
                          {qtyLoadingId === product.productId._id ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : product.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-white transition-colors cursor-pointer"
                          onClick={() => handleUpdateQuantity(product.productId._id, 'increase')}
                        > + </Button>
                      </div>

                      {/* Total Price (Desktop/Tablet view) */}
                      <div className='hidden sm:flex flex-col items-end min-w-[100px]'>
                        <p className='text-xs text-gray-400'>Total</p>
                        <p className='font-bold text-gray-800 text-sm sm:text-base'>
                          $ {(product?.productId?.productPrice * product?.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        disabled={removeLoadingId}
                        onClick={() => handleRemove(product?.productId?._id)}
                        className='text-red-500 hover:text-red-700 transition-all flex items-center gap-1 text-xs sm:text-sm font-medium flex-shrink-0 cursor-pointer'
                      >
                        {removeLoadingId === product.productId._id ?
                          <Loader2 className="h-4 w-4 animate-spin" /> :
                          <Trash2 className="w-4 h-4" />
                        }
                        <span className=''>Remove</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className='w-full lg:w-[380px]'>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className='flex justify-between text-gray-600'>
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>$ {subtotal?.toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between text-gray-600'>
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "Free" : `$ ${shipping}`}
                    </span>
                  </div>
                  <div className='flex justify-between text-gray-600'>
                    <span>Tax (5%)</span>
                    <span>$ {Tax?.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className='flex justify-between font-bold text-xl text-gray-900'>
                    <span>Total</span>
                    <span>$ {Total?.toLocaleString()}</span>
                  </div>

                  <div className='space-y-3 pt-4'>
                    <div className='flex space-x-2'>
                      <Input placeholder='Promo code' className="bg-gray-50" />
                      <Button variant='outline'>Apply</Button>
                    </div>
                    <Button
                      onClick={() => navigate('/address')}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-semibold rounded-xl cursor-pointer"
                    >
                      Place Order
                    </Button>
                    <Button variant='ghost' className="w-full border hover:border-none border-blue-300 border-dotted" asChild>
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className='text-[11px] uppercase tracking-wider text-gray-800 pt-6 space-y-2 border-t'>
                    <p className="flex items-center gap-2">✅ Free Shipping over $ 67</p>
                    <p className="flex items-center gap-2">✅ 30 Days Return Policy</p>
                    <p className="flex items-center gap-2">✅ Secure SSL Encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className='flex flex-col items-center justify-center min-h-[70vh] px-4'>
          <div className='bg-blue-50 p-8 rounded-full mb-6'>
            <ShoppingCart className='w-20 h-20 text-blue-500' />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h2>
          <p className='text-gray-500 mt-2 max-w-sm'>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button
            onClick={() => navigate('/products')}
            className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-6 rounded-xl"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  )
}

export default Cart