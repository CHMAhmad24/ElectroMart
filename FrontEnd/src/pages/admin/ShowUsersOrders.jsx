import OrderCard from '@/components/OrderCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ShowUsersOrders = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [userOrder, setUserOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken")
    try {
      setLoading(true)
      const res = await axios.get(`https://electromart-backend-sand.vercel.app/api/v1/order/userOrder/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        setUserOrder(res.data.orders)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserOrders();
  }, [])

  return (
    <div className="bg-gray-50 lg:pl-[320px] xl:pl-[330px] py-20 pr-4 md:pr-10 px-4 transition-all duration-300">      
      <div className="max-w-6xl mx-auto">        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(-1)} 
              className="rounded-full bg-white shadow-sm hover:bg-blue-50"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="font-bold text-2xl md:text-3xl text-gray-800 flex items-center gap-2">
                <ShoppingBag className="text-blue-600 h-7 w-7" /> User Orders
              </h1>
              <p className="text-gray-500 text-sm">Review history of all purchases for this account</p>
            </div>
          </div>

          {/* Optional: Order Count Badge */}
          {!loading && userOrder.length > 0 && (
            <div className="bg-blue-600 text-white px-4 mr-15 py-1.5 rounded-full text-sm font-semibold w-fit">
              Total Orders: {userOrder.length}
            </div>
          )}
        </div>

        {/* Orders Content Area */}
        <div className="w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-500 font-medium animate-pulse">Fetching orders...</p>
            </div>
          ) : userOrder.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl py-20 flex flex-col items-center justify-center text-center px-6">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-700">No Orders Found</h2>
              <p className="text-gray-500 max-w-xs mt-2">
                This user hasn't placed any orders yet. Once they do, they will appear here.
              </p>
              <Button 
                onClick={() => navigate(-1)} 
                variant="link" 
                className="mt-4 text-blue-600 font-semibold"
              >
                Go Back to Users
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              <OrderCard loading={loading} userOrder={userOrder} />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ShowUsersOrders