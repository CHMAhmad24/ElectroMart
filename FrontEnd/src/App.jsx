import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminProduct from './pages/admin/AdminProduct'
import AdminOrders from './pages/admin/AdminOrders'
import ShowUsersOrders from './pages/admin/ShowUsersOrders'
import AdminUsers from './pages/admin/AdminUsers'
import UserInfo from './pages/admin/UserInfo'
import ProtectedRoute from './components/ProtectedRoute'
import SingleProduct from './pages/SingleProduct'
import AuthSuccess from './pages/AuthSuccess'
import AddressForm from './pages/AddressForm'
import OrderSuccess from './pages/OrderSuccess'
import Login_Signup from './pages/Login_Signup'
// import Hero from './components/Hero'
// import Features from './components/Features'

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><Home /><Footer /></>,
  },
  {
    path: '/login',
    element: <><Login_Signup /></>,
  },
  {
    path: '/signup',
    element: <><Login_Signup /></>,
  },
  {
    path: '/auth-success',
    element: <><AuthSuccess /></>,
  },
  {
    path: '/verify/:token',
    element: <><VerifyEmail /></>,
  },
  {
    path: '/verify',
    element: <><Verify /></>,
  },
  {
    path: '/profile/:Id',
    element: <ProtectedRoute> <Navbar /><Profile /> </ProtectedRoute>,
  },
  {
    path: '/products',
    element: <><Navbar /><Products /></>,
  },
  {
    path: '/products/:id',
    element: <><Navbar /><SingleProduct /></>,
  },
  {
    path: '/cart',
    element: <ProtectedRoute><Navbar /><Cart /></ProtectedRoute>,
  },
  {
    path: '/address',
    element: <ProtectedRoute><Navbar /><AddressForm /></ProtectedRoute>,
  },
  {
    path: '/order-success',
    element: <ProtectedRoute><OrderSuccess /></ProtectedRoute>,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute adminOnly={true}><Navbar /><Dashboard /></ProtectedRoute>,
    children: [
      {
        path: "sales",
        element: <><AdminSales /></>
      },
      {
        path: "add-product",
        element: <><AddProduct /></>
      },
      {
        path: "products",
        element: <><AdminProduct /></>
      },
      {
        path: "orders",
        element: <><AdminOrders /></>
      },
      {
        path: "users/orders/:userId",
        element: <><ShowUsersOrders /></>
      },
      {
        path: "users",
        element: <><AdminUsers /></>
      },
      {
        path: "users/:Id",
        element: <><UserInfo /></>
      },
    ]
  },

])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
