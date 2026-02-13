import { setUser } from '@/ReduxToolkit/userSlice'
import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthSuccess = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const hasFetched = useRef(false);

  useEffect(() => {
    const handleAuth = async () => {
      if (hasFetched.current) return;
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get("token")

      if (accessToken) {
        hasFetched.current = true;
        localStorage.setItem("accessToken", accessToken)
        try {
          const res = await axios.get(`${BACKEND_URL}/api/v1/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })

          if (res.data.success) {
            dispatch(setUser(res.data.user)) //save user in redux store

            setTimeout(() => {
              navigate("/", { replace: true })
            }, 500);
          }
        } catch (error) {
          console.log("Error Fetching User", error)
          navigate("/login")
        }
      }
    }
    handleAuth();
  }, [navigate, dispatch, user])
  return (
    <div>
      {user ? (
        <p>Welcome, {user.name}</p>
      ) : (
        <p>Not Logged In</p>
      )}
    </div>
  )
}

export default AuthSuccess
