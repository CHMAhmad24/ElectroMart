import { setUser } from '@/ReduxToolkit/userSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AuthSuccess = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get("token")

      console.log(params)
      console.log("Token", accessToken)

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken)
        try {
          const res = await axios.get(`https://electromart-backend-five.vercel.app/api/v1/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })

          console.log("FULL RESPONSE FROM /me:", res.data)

          if (res.data.success) {
            dispatch(setUser(res.data.user)) //save user in redux store

            console.log("USER DISPATCHED TO REDUX:", res.data.user)

            navigate("/")
          }
        } catch (error) {
          console.log("Error Fetching User", error)
        }
      }
    }
    handleAuth();
  }, [navigate, dispatch])
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
