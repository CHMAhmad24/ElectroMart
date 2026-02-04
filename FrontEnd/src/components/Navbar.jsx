import React, { useState } from 'react'
import axios from 'axios'
import { Loader2, ShoppingCart, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/ReduxToolkit/userSlice'
import {clearProductState} from '@/ReduxToolkit/productSlice'

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product)
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem('accessToken');
  const admin = user?.role === "admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const displayName = user?.firstName || user?.username?.split(' ')[0] || "User";

  const toggleMenu = () => setIsOpen(!isOpen);

  const logoutHandle = async () => {
    try {
      setLoading(true);
      const res = await axios.post('https://electromart-backend-sand.vercel.app/api/v1/user/logout', {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true
      })
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success("Logout Successful");
        dispatch(clearProductState());
        
        localStorage.clear();
        navigate('/login');
        setIsOpen(false);
      }
    } catch (error) {
      console.log("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className='bg-blue-50 fixed w-full top-0 left-0 z-50 border-b border-blue-200'>

      {/* --- DARKEN OVERLAY --- */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleMenu}
      />

      <div className='max-w-7xl w-[90%] md:w-[85%] mx-auto flex justify-between items-center py-3'>

        {/* Logo */}
        <div onClick={() => navigate('/')} className='cursor-pointer z-10'>
          <h1 className='bg-gradient-to-r from-[#111827] via-[#374151] to-[#6b7280] bg-clip-text text-transparent font-bold text-2xl md:text-4xl'>
            ElectroMart
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex lg:gap-8 md:gap-4 items-center'>
          <ul className='flex lg:gap-7 md:gap-4 items-center lg:text-lg md:text-sm font-semibold'>
            <Link to="/" className="hover:text-blue-600 transition"><li>Home</li></Link>
            <Link to="/products" className="hover:text-blue-600 transition"><li>Products</li></Link>
            {user && <Link className="hover:text-blue-600 transition" to={`/profile/${user._id}`}><li>Hello, {displayName}</li></Link>}
            {admin && <Link className="hover:text-blue-600 transition" to={`/dashboard/sales`}><li>Dashboard</li></Link>}
          </ul>

          <div className='flex items-center gap-5'>
            <Link to="/cart" className="hover:text-blue-600 transition relative">
              <ShoppingCart className="w-6 h-6" />
              {cart?.items?.length > 0 && (
                <span className='bg-blue-500 rounded-full text-[10px] text-white absolute -top-2 -right-2 px-1.5 font-bold'>
                  {cart.items.length}
                </span>
              )}
            </Link>
            {user ? (
              <Button disabled={loading} onClick={logoutHandle} className='bg-blue-600 text-white cursor-pointer'>
                {loading ? <>Loading <Loader2 className='h-4 w-4 animate-spin' /></> : "Logout"}
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} className='bg-gradient-to-tl from-blue-500 to-purple-700 text-white cursor-pointer'>
                Login
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Icons & Hamburger Icon */}
        <div className='flex md:hidden items-center gap-4'>
          <Link to="/cart" className='relative'>
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cart?.items?.length > 0 && (
              <span className='bg-blue-500 rounded-full text-[10px] text-white absolute -top-2 -right-2 px-1.5 font-bold'>
                {cart.items.length}
              </span>
            )}
          </Link>
          <button onClick={toggleMenu} className='text-gray-700 focus:outline-none z-[60]'>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR MOBILE MENU --- */}
      <div className={`fixed top-0 right-0 h-full w-[60%] sm:w-[60%] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex flex-col h-full p-6 pt-20'>
          <ul className='flex flex-col gap-6 font-semibold text-xl text-gray-800'>
            <Link to="/" onClick={toggleMenu} className='border-b border-gray-100 pb-2'><li>Home</li></Link>
            <Link to="/products" onClick={toggleMenu} className='border-b border-gray-100 pb-2'><li>Products</li></Link>
            {user && (
              <Link to={`/profile/${user._id}`} onClick={toggleMenu} className='border-b border-gray-100 pb-2'>
                <li>Profile ({displayName})</li>
              </Link>
            )}
            {admin && (
              <Link to={`/dashboard/sales`} onClick={toggleMenu} className='border-b border-gray-100 pb-2'>
                <li>Dashboard</li>
              </Link>
            )}
          </ul>

          <div className='mt-auto pb-10'>
            {user ? (
              <Button disabled={loading} onClick={logoutHandle} className='w-full bg-red-500 hover:bg-red-600 text-white py-6 text-lg rounded-xl'>
                {loading ? <Loader2 className='h-5 w-5 animate-spin' /> : "Logout"}
              </Button>
            ) : (
              <Button onClick={() => { navigate('/login'); toggleMenu(); }} className='w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl'>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar