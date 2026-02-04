import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const { token } = useParams()
    const [status, setStatus] = useState('Verifying...');
    const navigate = useNavigate();

    const verifyEmail = async () => {
        try {
            const response = await axios.post(`https://electromart-backend-sand.vercel.app/api/v1/user/verify`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setStatus('✅ Your email has been verified successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setStatus('❌ Verification failed. Please try again.');
            }
        }
        catch (error) {
            console.log(error)
            setStatus('❌ Verification failed. Please try again.');
        }
    }

    useEffect(() => {
        verifyEmail();        /* eslint-disable react-hooks/exhaustive-deps */
    }, [token]);

    return (
        <div className='relative w-full `h-[760px]` overflow-hidden bg-blue-100'>
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-md w-[90%] max-w-md text-center">
                    <h2 className='text-xl font-semibold text-gray-800'>{status}</h2>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail