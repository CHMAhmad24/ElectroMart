import React, { useEffect, useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import axios from 'axios';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Carousel = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [productsdata, setProductsData] = useState([]);

  const SamplePrevArrow = (props) => {
    const { onClick } = props
    return (
      <div onClick={onClick} className="absolute left-2 md:left-10 top-[24%] md:top-1/2 -translate-y-1/2 z-20 cursor-pointer">
        <AiOutlineArrowLeft className='text-white bg-[#f53347] rounded-full p-1.5 md:p-2 w-8 h-8 md:w-10 md:h-10 hover:bg-[#555] transition-all shadow-lg' />
      </div>
    )
  }

  const SampleNextArrow = (props) => {
    const { onClick } = props
    return (
      <div onClick={onClick} className="absolute right-2 md:right-10 top-[24%] md:top-1/2 -translate-y-1/2 z-20 cursor-pointer">
        <AiOutlineArrowRight className='text-white bg-[#f53347] rounded-full p-1.5 md:p-2 w-8 h-8 md:w-10 md:h-10 hover:bg-[#555] transition-all shadow-lg' />
      </div>
    )
  }

  var settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    pauseOnHover: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get('https://electromart-backend-sand.vercel.app/api/v1/products/getAllProducts')
      setProductsData(res.data.products)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAllProducts() }, [])

  return (
    /* GRADIENT KO YAHAN LAGAYA HAI - AB YE FIXED RAHEGA */
    <div className='relative overflow-hidden max-w-[1600px] mx-auto bg-gradient-to-tr from-white via-blue-200 to-purple-200'>

      {loading ? (
        <div className='flex h-[500px] lg:h-[600px] justify-center items-center text-2xl font-bold'>
          <Loader2 className='h-8 w-8 animate-spin mr-3 text-[#f53347]' /> Please wait
        </div>
      ) : (
        <Slider {...settings}>
          {productsdata?.slice(0, 5)?.map((Item, index) => (
            /* Slide ke ander se background classes hata di hain */
            <div key={index} className='outline-none'>
              <div className='flex flex-col lg:flex-row gap-6 md:gap-10 justify-center items-center min-h-[500px] lg:h-[600px] px-6 py-10 lg:py-0'>

                {/* Text Content */}
                <div className='space-y-4 md:space-y-6 text-center lg:text-left order-2 lg:order-1'>
                  <h3 className='text-red-500 font-semibold text-xs md:text-sm tracking-wide'>
                    Powering your world with the best in electronics
                  </h3>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase line-clamp-2 w-full md:max-w-[500px] text-white drop-shadow-md'>
                    {Item.productName}
                  </h1>
                  <p className='text-sm md:text-base md:w-[500px] line-clamp-3 text-gray-500 lg:pr-7'>
                    {Item.productDesc}
                  </p>
                  <button onClick={() => navigate(`/products/${Item._id}`)} className='bg-gradient-to-r from-red-500 to-purple-500 text-white px-8 py-3 rounded-md cursor-pointer mt-2 hover:scale-105 transition-transform font-bold shadow-lg'>
                    Shop Now
                  </button>
                </div>

                {/* Image Section */}
                <div className='order-1 lg:order-2'>
                  <img
                    src={Item.productImg[2]?.url || Item.productImg[0]?.url}
                    alt={Item.productName}
                    className='rounded-full bg-transparent w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] transition-transform duration-700 hover:scale-105 shadow-2xl shadow-blue-900/20 object-cover border-4 border-white/30'
                  />
                </div>

              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  )
}

export default Carousel