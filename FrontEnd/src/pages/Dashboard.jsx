import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex min-h-screen bg-gray-100 overflow-x-hidden'>
      {/* Hamburger Menu */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className='fixed top-20 right-5 z-50 p-2 bg-blue-600 text-white rounded-lg lg:hidden shadow-md hover:bg-blue-700 transition-colors'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Component */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {isOpen && (
        <div 
          className='fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className='flex-1 w-full'>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard