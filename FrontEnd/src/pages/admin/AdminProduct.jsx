import { Input } from '@/components/ui/input'
import { Edit, Loader2, Search, Trash2, Package } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import axios from 'axios'
import { toast } from 'sonner'
import { setProducts } from '@/ReduxToolkit/productSlice'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AdminProduct = () => {
    const { products } = useSelector(store => store.product)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    const dispatch = useDispatch()
    const [deleting, setDeleting] = useState(null)
    const [loading, setLoading] = useState(false)
    const [editProduct, setEditProduct] = useState(null)
    const accessToken = localStorage.getItem("accessToken")
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditProduct(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("productName", editProduct.productName)
        formData.append("productPrice", editProduct.productPrice)
        formData.append("productDesc", editProduct.productDesc)
        formData.append("category", editProduct.category)
        formData.append("brand", editProduct.brand)

        const existingImages = editProduct.productImg
            .filter((img) => !(img instanceof File) && img.public_id)
            .map((img) => img.public_id)

        formData.append("existingImages", JSON.stringify(existingImages))

        editProduct.productImg
            .filter((img) => img instanceof File)
            .forEach((file) => {
                formData.append("files", file)
            });

        try {
            setLoading(true)
            const res = await axios.put(`https://electromart-backend-sand.vercel.app/api/v1/products/update/${editProduct._id}`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (res.data.success) {
                toast.success("Product Updated Successfully")
                const updatedProducts = products.map((p) => p._id === editProduct._id ? res.data.product : p)
                dispatch(setProducts(updatedProducts))
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to update product")
        } finally {
            setLoading(false)
        }
    }

    const deleteProductHandler = async (productId) => {
        try {
            setDeleting(productId)
            const res = await axios.delete(`https://electromart-backend-sand.vercel.app/api/v1/products/delete/${productId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setProducts(products.filter((p) => p._id !== productId)))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setDeleting(null)
        }
    }

    let filteredProducts = products.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortOrder === 'lowToHigh') filteredProducts.sort((a, b) => a.productPrice - b.productPrice)
    if (sortOrder === 'highToLow') filteredProducts.sort((a, b) => b.productPrice - a.productPrice)

    return (
        <div className='lg:pl-[350px] py-20 px-4 md:px-10 lg:pr-20 flex flex-col gap-6 min-h-screen bg-gray-50'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-100 p-4 rounded-xl shadow-sm border'>
                <div className='relative w-full md:w-[400px]'>
                    <Input 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder='Search products...' 
                        className="pl-4 pr-10 h-11 bg-gray-50 border-gray-200"
                    />
                    <Search className='absolute right-3 top-3 h-5 w-5 text-gray-400' />
                </div>
                
                <Select onValueChange={(value) => setSortOrder(value)}>
                    <SelectTrigger className="w-full md:w-[200px] h-11 bg-gray-50 cursor-pointer">
                        <SelectValue placeholder="Sort By Price" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="lowToHigh" className='cursor-pointer'>Price: Low to High</SelectItem>
                        <SelectItem value="highToLow" className='cursor-pointer'>Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Product List */}
            <div className='flex flex-col gap-4'>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Card key={product._id} className="p-3 md:p-4 hover:shadow-md transition-shadow duration-200 border-gray-200">
                            <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                                
                                {/* Info Section */}
                                <div className='flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto'>
                                    <div className='w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                                        <img 
                                            src={product.productImg[0]?.url || 'https://via.placeholder.com/150'} 
                                            alt={product.productName} 
                                            className='w-full h-full object-cover' 
                                        />
                                    </div>
                                    <div className='text-center sm:text-left'>
                                        <h1 className='font-bold text-gray-800 text-lg line-clamp-1 max-w-[250px] md:max-w-md'>
                                            {product.productName}
                                        </h1>
                                        <p className='text-sm text-blue-500 font-medium'>{product.brand} • {product.category}</p>
                                    </div>
                                </div>

                                {/* Price & Actions */}
                                <div className='flex flex-row sm:flex-col md:flex-row items-center justify-between sm:justify-center w-full sm:w-auto gap-4 md:gap-8 border-t sm:border-none pt-3 sm:pt-0'>
                                    <span className='font-bold text-xl text-gray-900'>
                                        ${product.productPrice.toLocaleString()}
                                    </span>
                                    
                                    <div className='flex gap-2'>
                                        {/* Edit Dialog */}
                                        <Dialog open={isDialogOpen && editProduct?._id === product._id} onOpenChange={(open) => {
                                            if(!open) setIsDialogOpen(false);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon" onClick={() => { setEditProduct(product); setIsDialogOpen(true); }} className="hover:bg-green-50 border-green-200 cursor-pointer">
                                                    <Edit className='h-4 w-4 text-green-600' />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="w-[95%] sm:max-w-[625px] max-h-[90vh] overflow-y-auto rounded-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl">Edit Product</DialogTitle>
                                                    <DialogDescription>Modify details for {product.productName}</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label>Product Name</Label>
                                                        <Input name="productName" value={editProduct?.productName} onChange={handleChange} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                            <Label>Price ($)</Label>
                                                            <Input type="number" name="productPrice" value={editProduct?.productPrice} onChange={handleChange} />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label>Brand</Label>
                                                            <Input name="brand" value={editProduct?.brand} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Category</Label>
                                                        <Input name="category" value={editProduct?.category} onChange={handleChange} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Description</Label>
                                                        <Textarea name="productDesc" value={editProduct?.productDesc} onChange={handleChange} rows={4} />
                                                    </div>
                                                    <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                                                </div>
                                                <DialogFooter className="flex-col sm:flex-row gap-2">
                                                    <DialogClose asChild>
                                                        <Button variant="ghost" className='cursor-pointer'>Cancel</Button>
                                                    </DialogClose>
                                                    <Button disabled={loading} onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                                        {loading ? <><Loader2 className='animate-spin mr-2' />Updating...</> : "Save Changes"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Delete Alert */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button disabled={deleting} variant="outline" size="icon" className="hover:bg-red-50 border-red-200 cursor-pointer">
                                                    {deleting === product._id ? <Loader2 className="h-4 w-4 animate-spin text-red-600" /> : <Trash2 className="h-4 w-4 text-red-600" />}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="w-[95%] rounded-xl">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will remove <b>{product.productName}</b> permanently.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteProductHandler(product._id)} className='bg-red-600 hover:bg-red-700 cursor-pointer'>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed'>
                        <Package className='h-12 w-12 text-gray-300 mb-2' />
                        <p className='text-gray-500'>No products found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminProduct;