import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: [], 
  });

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(`${BACKEND_URL}/api/v1/order/sales`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats(); /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 transition-all duration-300 pt-24 pb-10 px-4 md:px-8 lg:pl-77.5 lg:pr-10 xl:pl-92.5 xl:pr-20'>      
      <div className='max-w-350 mx-auto space-y-8'>
        <h1 className='text-2xl md:text-3xl font-black text-gray-800 tracking-tight'>
          Sales Analytics
        </h1>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'>
          <Card className='bg-blue-500 text-white shadow-xl border-none'>
            <CardHeader className='pb-1'>
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl md:text-4xl font-black'>{stats.totalUsers}</div>
            </CardContent>
          </Card>

          {/* Total Products Card */}
          <Card className='bg-blue-500 text-white shadow-xl border-none'>
            <CardHeader className='pb-1'>
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl md:text-4xl font-black'>{stats.totalProducts}</div>
            </CardContent>
          </Card>

          {/* Total Orders Card */}
          <Card className='bg-blue-500 text-white shadow-xl border-none'>
            <CardHeader className='pb-1'>
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl md:text-4xl font-black'>{stats.totalOrders}</div>
            </CardContent>
          </Card>

          {/* Total Sales Card */}
          <Card className='bg-blue-500 text-white shadow-xl border-none'>
            <CardHeader className='pb-1'>
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black'>
                <span className='mr-2'>$</span>
                {stats.totalSales?.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart Section */}
        <Card className='shadow-md border-none bg-white'>
          <CardHeader className='border-b border-gray-50 pb-4'>
            <CardTitle className='text-lg font-bold text-gray-700'>Revenue Stream (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className="h-70 md:h-87.5 lg:h-100 w-full">
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={stats.sales || stats.salesByDate} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    minTickGap={30}
                  />
                  <YAxis 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#1e90ff" 
                    strokeWidth={4}
                    fill='#1e90ff' 
                    fillOpacity={0.15} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSales;