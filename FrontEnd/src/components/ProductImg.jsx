import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images }) => {
    const [mainImg, setMainImg] = useState(images[0].url)
    return (
        <div className='flex flex-col-reverse lg:flex-row gap-5'>
            {/* Thumbnails Container */}
            <div className='flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 scrollbar-hide'>
                {images.map((img, index) => (
                    <img
                        key={index}
                        onClick={() => setMainImg(img.url)}
                        src={img.url}
                        alt="thumbnail"
                        className={`cursor-pointer w-20 h-20 min-w-[80px] border shadow-sm object-cover rounded-md transition-all ${mainImg === img.url ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200'}`}
                    />
                ))}
            </div>

            {/* Main Image */}
            <div className='flex-1'>
                <Zoom>
                    <img
                        src={mainImg}
                        alt="main-product"
                        className='w-full max-h-[500px] border shadow-md rounded-lg object-contain bg-white'
                    />
                </Zoom>
            </div>
        </div>
    )
}

export default ProductImg