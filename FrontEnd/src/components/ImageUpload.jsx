import { Label } from '@radix-ui/react-label'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { X } from 'lucide-react'


const ImageUpload = ({ productData, setProductData }) => {
    const handleFiles = (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            setProductData((prev) => ({
                ...prev, productImg: [...(prev.productImg || []), ...files]
            }))
        }
        e.target.value = null;
    }

    const removeImg = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setProductData((prev) => {
            const updatedImages = prev.productImg.filter((_, i) => i !== index)
            return { ...prev, productImg: updatedImages }
        })
    }

    return (
        <div className='grid gap-2'>
            <Label>Product Images</Label>
            <Input type='file' id="file-upload" className="hidden" accept="image/*" multiple onChange={handleFiles} />
            <Button type="button" variant='outline' className='cursor-pointer'>
                <label htmlFor="file-upload" className='w-full cursor-pointer'>Upload Images</label>
            </Button>

            {/* Image preview */}

            {
                (productData?.productImg?.length || 0) > 0 && (
                    <div className='grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3'>
                        {
                            productData.productImg.map((file, idx) => {
                                // check if file is already a file (foom input) or a DB onject/string
                                let preview
                                if (file instanceof File) {
                                    preview = URL.createObjectURL(file)
                                } else if (typeof file === 'string') {
                                    preview = file
                                } else if (file?.url) {
                                    preview = file.url
                                } else {
                                    return null
                                }
                                return (
                                    <Card key={idx} className='relative group overflow-hidden'>
                                        <CardContent>
                                            <img src={preview} alt="" width={200} height={200} className='w-[250px] object-cover rounded-md' />
                                            {/* Remove Button */}
                                            <button type='button' onClick={(e) => removeImg(e, idx)} className='absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition'><X /></button>
                                        </CardContent>
                                    </Card>
                                )

                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ImageUpload