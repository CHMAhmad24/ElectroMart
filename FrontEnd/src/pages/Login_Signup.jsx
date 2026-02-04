import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import { Button } from '@/components/ui/button';
import { FaQuestion } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import '../CSS/style.css'

function Login_Signup() {
  const location = useLocation();
  const [isActive, setIsActive] = useState(location.pathname === '/signup');

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-r from-[#e2e2e2] to-[#c9d6ff] p-5 font-['poppins']">
      <div className="hidden lg:relative lg:block lg:w-237.5 lg:h-137.5 bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className={`absolute top-0 right-0 w-1/2 h-full bg-white flex items-center p-10 transition-all duration-1800 ease-in-out
          ${isActive ? '-translate-x-full opacity-0 invisible z-0' : 'translate-x-0 opacity-100 visible z-10'}`}>
          <Login />
        </div>

        <div className={`absolute top-0 right-0 w-1/2 h-full bg-white flex items-center p-10 transition-all duration-1800 ease-in-out
          ${isActive ? 'right-1/2 opacity-100 visible z-10' : 'translate-x-full opacity-0 invisible z-0'}`}>
          <Signup />
        </div>

        <div className="absolute w-full h-full pointer-events-none z-20">
          <div className={`absolute top-0 w-[300%] h-full bg-[#7494ec] rounded-[150px] transition-all duration-1800 ease-in-out pointer-events-auto
            ${isActive ? 'left-[50%]' : '-left-[250%]'}`}>
            <div className="flex h-full w-full relative">
              <div className={`absolute left-0 w-1/6 h-full flex flex-col items-center justify-center text-white px-10 transition-all duration-2000
                ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                  <h1 className="text-[36px] font-bold -mb-2.5">Hello Welcome!</h1>
                <p className="text-[14.5px] my-3.75 text-center flex items-center gap-2">
                  Already have an account<FaQuestion size={14} />
                </p>
                <Button asChild onClick={() => setIsActive(false)}
                  className="w-40 h-11.5 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-[#7494ec] transition-all">
                  <Link to='/login'>Log In</Link>
                </Button>
              </div>
              <div className={`absolute right-0 w-1/6 h-full flex flex-col items-center justify-center text-white px-10 transition-all duration-2000
                ${isActive ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                <h1 className="text-[36px] font-bold -mb-2.5">Welcome Back!</h1>
                <p className="text-[14.5px] my-3.75 text-center flex items-center gap-2">
                  Don't have an account<FaQuestion size={14} />
                </p>
                <Button asChild onClick={() => setIsActive(true)}
                  className="w-40 h-11.5 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-[#7494ec] transition-all">
                  <Link to='/signup'>Register</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block lg:hidden w-full max-w-112.5 bg-white rounded-2xl shadow-xl overflow-hidden p-6">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#7494ec]">
              {isActive ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isActive ? 'Sign up to get started' : 'Please login to your account'}
            </p>
          </div>

          <div className="transition-opacity duration-500">
            {isActive ? <Signup /> : <Login />}
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 mb-2">
              {isActive ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Button
              onClick={() => setIsActive(!isActive)}
              className="font-bold hover:underline bg-blue-500 text-white"
            >
              <Link to={isActive ? '/login' : '/signup'}>
                {isActive ? 'Log In' : 'Register Now'}
              </Link>
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login_Signup;

