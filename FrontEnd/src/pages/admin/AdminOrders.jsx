import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Package, Calendar, User, DollarSign, Clock, Loader2 } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken")

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://electromart-backend-five.vercel.app/api/v1/order/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error("❌ API Error:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `https://electromart-backend-five.vercel.app/api/v1/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        toast.success(`Order status changed to ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  useEffect(() => {
    fetchOrders()
  }, [accessToken])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-red-100 text-red-700 border-red-200';
    }
  }

  if (loading) return (
    <div className='flex flex-col items-center justify-center min-h-screen lg:pl-80'>
      <Loader2 className='animate-spin text-blue-600 h-10 w-10' />
      <p className='text-gray-500 mt-4 font-medium'>Loading orders history...</p>
    </div>
  )

  return (
    <div className="bg-gray-50 lg:pl-75 xl:pl-82.5 py-25 px-4 md:px-10 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className='mb-8'>
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3">
            <Package className="text-blue-600" /> Orders Management
          </h1>
          <p className='text-gray-500 text-sm'>Monitor and manage all customer transactions</p>
        </div>

        {orders?.length === 0 ? (
          <div className='bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-200'>
             <Clock className='mx-auto text-gray-300 h-12 w-12 mb-4' />
             <p className="text-gray-500 font-bold text-xl">No orders found in database.</p>
          </div>
        ) : (
          <>
            <div className="hidden xl:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Products</th>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders?.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">#{order._id.slice(-8)}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{order.user?.firstName} {order.user?.lastName}</div>
                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {order.products.map((p, idx) => (
                          <div key={idx} className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md mb-1 w-fit">
                            {p.productId?.productName} <span className='font-black'>×{p.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 font-black text-gray-900">
                        ${order.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders?.map((order) => (
                <div key={order._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                  <div className='flex justify-between items-start mb-4'>
                    <span className='font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded'>#{order._id.slice(-8)}</span>
                    <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border outline-none ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <User size={16} className='text-gray-400' />
                      <div className='text-sm font-bold text-gray-800'>{order.user?.firstName || 'User'} ({order.user?.email})</div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <Package size={16} className='text-gray-400 mt-1' />
                      <div className='flex flex-wrap gap-1'>
                        {order.products.map((p, i) => (
                          <span key={i} className='text-[10px] bg-gray-100 px-2 py-0.5 rounded'>{p.productId?.productName} (x{p.quantity})</span>
                        ))}
                      </div>
                    </div>
                    <div className='flex justify-between items-center border-t pt-3 mt-3'>
                      <div className='flex items-center gap-1 text-gray-500 text-xs'>
                        <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className='flex items-center gap-1 font-black text-lg text-gray-900'>
                        <DollarSign size={16} />{order.amount?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;