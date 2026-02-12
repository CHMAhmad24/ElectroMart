import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Camera } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import userpng from "../../Assets/User-png.webp"
import { setUser } from '@/ReduxToolkit/userSlice'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserInfo = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.Id;

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    role: "",
    profilePic: "",
    avatar: "",
  })

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const displayAvatar = updateUser?.profilePic || updateUser?.avatar || userpng;
  const { user: loggedInUser } = useSelector(store => store.user);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const accessToken = localStorage.getItem("accessToken")
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(updateUser).forEach(key => {
        if (updateUser[key] !== null) formData.append(key, updateUser[key]);
      });

      if (file) formData.append("file", file);

      const res = await axios.put(`${BACKEND_URL}/api/v1/user/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data.success) {
        toast.success(res.data.message)
        if (userId === loggedInUser?._id) {
          dispatch(setUser(res.data.user));
        } else {
          toast.success("Admin session preserved successfully while updating another user.");
          navigate(`/dashboard/users`)
        }
      }
    } catch (error) {
      console.log("error updating User", error)
      toast.error("Failed To Update Profile")
    } finally {
      setLoading(false);
    }
  }

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/getUserById/${userId}`)
      if (res.data.success) {
        setUpdateUser(prevState => ({ ...prevState, ...res.data.user }));
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <div className='bg-gray-100 lg:pl-[320px] xl:pl-[380px] p-4 mt-15 md:p-10 transition-all duration-300'>
      <div className='max-w-5xl mx-auto'>

        {/* Header with Back Button */}
        <div className='flex items-center gap-4 mb-8'>
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full shadow-sm cursor-pointer">
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='font-bold text-2xl md:text-3xl text-gray-800'>Update Profile</h1>
        </div>

        {/* Main Layout Container */}
        <div className='flex flex-col lg:flex-row gap-8 items-start'>

          {/* Left Side: Profile Picture Card */}
          <div className='w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center'>
            <div className='relative group'>
              <img
                src={displayAvatar}
                alt="Profile"
                className='w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-600 shadow-md'
              />
              <Label className='absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-lg transition-transform active:scale-90'>
                <Camera size={20} />
                <input type="file" accept='image/*' onChange={handleFileChange} className='hidden' />
              </Label>
            </div>
            <div className='text-center mt-4'>
              <h2 className='font-bold text-lg text-gray-800'>{updateUser.firstName} {updateUser.lastName}</h2>
              <p className={`text-sm font-semibold ${updateUser.role === 'admin' ? 'text-green-600' : 'text-blue-600'}`}>
                {updateUser.role?.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className='w-full lg:flex-1'>
            <form onSubmit={handleSubmit} className='bg-white shadow-xl p-6 md:p-8 rounded-2xl border border-gray-100 space-y-5'>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {updateUser?.username ? (
                  <div className='md:col-span-2'>
                    <Label className='text-sm font-bold text-gray-700'>Username</Label>
                    <Input name='username' value={updateUser?.username} onChange={handleChange} className='mt-1.5 h-11' />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label className='text-sm font-bold text-gray-700'>First Name</Label>
                      <Input name='firstName' value={updateUser?.firstName} onChange={handleChange} className='mt-1.5 h-11' />
                    </div>
                    <div>
                      <Label className='text-sm font-bold text-gray-700'>Last Name</Label>
                      <Input name='lastName' value={updateUser?.lastName} onChange={handleChange} className='mt-1.5 h-11' />
                    </div>
                  </>
                )}

                <div className='md:col-span-2'>
                  <Label className='text-sm font-bold text-gray-700'>Email Address</Label>
                  <Input value={updateUser?.email} disabled className='mt-1.5 h-11 bg-gray-50 text-gray-500 italic' />
                </div>

                <div className='md:col-span-2'>
                  <Label className='text-sm font-bold text-gray-700'>Phone Number</Label>
                  <Input type="number" name='phoneNo' value={updateUser?.phoneNo} onChange={handleChange} className='mt-1.5 h-11' />
                </div>

                <div className='md:col-span-2'>
                  <Label className='text-sm font-bold text-gray-700'>Full Address</Label>
                  <Input name='address' value={updateUser?.address} onChange={handleChange} className='mt-1.5 h-11' />
                </div>

                <div>
                  <Label className='text-sm font-bold text-gray-700'>City</Label>
                  <Input name='city' value={updateUser?.city} onChange={handleChange} className='mt-1.5 h-11' />
                </div>

                <div>
                  <Label className='text-sm font-bold text-gray-700'>Zip Code</Label>
                  <Input type="number" name='zipCode' value={updateUser?.zipCode} onChange={handleChange} className='mt-1.5 h-11' />
                </div>
              </div>

              {/* Role Selection */}
              <div className='bg-gray-50 p-4 rounded-xl flex items-center gap-6'>
                <Label className='font-bold text-gray-700'>System Role:</Label>
                <RadioGroup
                  value={updateUser.role}
                  onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })}
                  className='flex gap-4'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="cursor-pointer">User</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                disabled={loading}
                type="submit"
                className='w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] cursor-pointer'
              >
                {loading ? <><Loader2 className='animate-spin mr-2' /> Saving Changes...</> : "Update Profile"}
              </Button>

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserInfo;