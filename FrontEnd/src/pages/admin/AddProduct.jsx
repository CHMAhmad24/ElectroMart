import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/ReduxToolkit/productSlice'
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { products } = useSelector(store => store.product)
  const navigate = useNavigate()

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image")
      return;
    }

    productData.productImg.forEach((img) => {
      formData.append("files", img)
    })

    try {
      setLoading(true)
      const res = await axios.post(`https://electromart-backend-five.vercel.app/api/v1/products/add`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]))
        toast.success(res.data.message)
        navigate('/products')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-blue-100 flex flex-col pt-20 pb-10 px-4 md:px-8 lg:pl-[320px] xl:pl-[380px]'>

      <Card className='w-full max-w-5xl mx-auto shadow-sm border-none'>
        <CardHeader className="pb-4">
          <CardTitle className='font-bold text-2xl md:text-3xl text-gray-800'>Add Product</CardTitle>
          <CardDescription>Enter product details below</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler} className='space-y-6'>

            {/* Input Grid: Mobile par 1 column, Laptop (1024px) par 2 columns */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>

              <div className='space-y-2'>
                <Label className='font-bold text-sm text-gray-700'>Product Name</Label>
                <Input type='text' name='productName' value={productData.productName} onChange={handleChange} placeholder='I-Phone' required className="bg-white" />
              </div>

              <div className='space-y-2'>
                <Label className='font-bold text-sm text-gray-700'>Product Price</Label>
                <Input type='Number' name='productPrice' value={productData.productPrice} onChange={handleChange} required className="bg-white" />
              </div>

              <div className='space-y-2'>
                <Label className='font-bold text-sm text-gray-700'>Brand</Label>
                <Input type='text' name='brand' value={productData.brand} onChange={handleChange} placeholder='Apple' required className="bg-white" />
              </div>

              <div className='space-y-2'>
                <Label className='font-bold text-sm text-gray-700'>Category</Label>
                <Input type='text' name='category' value={productData.category} onChange={handleChange} placeholder='Mobile' required className="bg-white" />
              </div>

            </div>

            {/* Description Section */}
            <div className='space-y-2'>
              <Label className='font-bold text-sm text-gray-700'>Description</Label>
              <Textarea
                name='productDesc'
                value={productData.productDesc}
                onChange={handleChange}
                placeholder='Enter brief description of product'
                className="min-h-[120px] bg-white"
              />
            </div>

            <div className='space-y-2'>
              <Label className='font-bold text-sm text-gray-700'>Product Images</Label>
              <div className='bg-white p-1 rounded-md border border-dashed border-gray-300'>
                <ImageUpload productData={productData} setProductData={setProductData} />
              </div>
            </div>
            <CardFooter className='px-0 pt-4'>
              <Button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors h-12 text-white font-semibold text-base cursor-pointer"
                type="submit"
              >
                {loading ? (
                  <span className='flex gap-2 items-center'>
                    <Loader2 className='animate-spin h-5 w-5' /> Please wait
                  </span>
                ) : "Add Product"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddProduct