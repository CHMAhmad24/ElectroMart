import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Edit, Eye, Search, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import UserLogo from "../../Assets/User-png.webp"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminUsers = () => {
  const [users, setUesrs] = useState([])
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.username}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken")
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/allUsers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        setUesrs(res.data.users)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllUsers() /* eslint-disable react-hooks/exhaustive-deps */
  }, [])

  return (
    <div className='bg-white lg:pl-80 xl:pl-80 py-20 md:py-25 pr-4 md:pr-10 xl:pr-20 px-4 transition-all duration-300'>
      <div className='flex flex-col gap-1 mb-8'>
        <h1 className='font-bold text-2xl md:text-3xl text-gray-800 flex items-center gap-2'>
          <Users className="text-blue-600" /> Users Management
        </h1>
        <p className='text-gray-500'>View and manage registered users</p>
      </div>

      <div className='flex relative w-full md:w-80 mb-10'>
        <Search className='absolute left-3 top-2.5 text-gray-400 w-5 h-5' />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, username or email..."
          className="pl-10 h-11 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
        {
          filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => {
              return (
                <div key={index} className='bg-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow'>
                  <div className='flex items-start gap-4'>
                    <img
                      src={user?.profilePic || user?.avatar || UserLogo}
                      alt="User"
                      className='rounded-full w-16 h-16 aspect-square object-cover border-2 border-white shadow-sm flex-shrink-0'
                    />
                    <div className='overflow-hidden'>
                      <h1 className='font-bold text-gray-800 truncate' title={`${user?.firstName} ${user?.lastName}`}>
                        {user?.firstName} {user?.lastName} {user?.username}
                      </h1>
                      <p className={`text-sm font-medium mb-1 ${user?.role === 'admin' ? 'text-green-600' : 'text-blue-600'}`}>
                        @{user?.role}
                      </p>
                      <p className='text-xs text-gray-600 truncate' title={user?.email}>{user?.email}</p>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2 mt-5'>
                    <Button
                      onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                      variant='outline'
                      className='flex-1 gap-2 bg-white hover:bg-gray-50 border-blue-200 text-blue-700 h-10 cursor-pointer'
                    >
                      <Edit size={16} /> Edit
                    </Button>
                    <Button
                      onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}
                      className='flex-1 gap-2 bg-blue-600 hover:bg-blue-700 h-10 cursor-pointer'
                    >
                      <Eye size={16} /> Orders
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className='col-span-full py-20 text-center text-gray-400'>
              <Users size={48} className='mx-auto mb-2 opacity-20' />
              <p>No users found.</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default AdminUsers