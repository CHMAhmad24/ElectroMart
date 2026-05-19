import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, useNavigate, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { setUser } from '@/ReduxToolkit/userSlice'
import { clearProductState } from '@/ReduxToolkit/productSlice'
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
import ForgotPassword from './pages/ForgotPassword'
import { toast } from 'sonner'

// ─── CRON/INTERVAL JOB WRAPPER TO TRACK SESSION ───
const RootLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenCron = () => {
      const currentToken = localStorage.getItem('accessToken');

      // Agar token nahi hai toh agay code mat chalao (Bina wajah crash nahi hoga)
      if (!currentToken) return;

      try {
        const decodedToken = jwtDecode(currentToken);
        const currentTime = Date.now() / 1000; // Seconds

        // If token is expired 
        if (decodedToken.exp < currentTime) {
          // ✅ Fix: Loop ke andar se clearInterval hata diya taaki undefined error na aaye
          dispatch(setUser(null));
          dispatch(clearProductState());
          localStorage.clear();
          navigate('/login');

          setTimeout(() => {
            toast.error("Your session has expired, Please log in again.");
          }, 200);
        }
      } catch (error) {
        console.error("Token checking failed:", error);
        dispatch(setUser(null));
        dispatch(clearProductState());
        localStorage.clear();
        navigate('/login');
      }
    };

    // Page load ya refresh par foran check karein
    checkTokenCron();

    // Har 2 second baad background loop chalayein
    const tokenCheckInterval = setInterval(checkTokenCron, 2000);

    // ✅ Clean up interval properly on component unmount
    return () => clearInterval(tokenCheckInterval);
  }, [dispatch, navigate]);

  return <Outlet />; // Yeh child routes ko smoothly render karega
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
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
        path: '/forgot-password',
        element: <><ForgotPassword /></>,
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
            path: "sales", // ✅ Fix: Yahan "/FrontEnd/sales" ko clean karke "sales" kiya taaki dashboard routing breakdown na ho
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
    ]
  }
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App;