import Carousel from '@/components/Carousel'
import Features from '@/components/Features'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import React, { useEffect } from 'react'

const Home = () => {
  useEffect(() => {
          window.scrollTo(0, 0);
      }, [])
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Carousel />
    </div>
  )
}

export default Home