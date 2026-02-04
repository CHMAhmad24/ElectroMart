import axios from "axios";
import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";

const MyOrders = () => {
    const [userOrder, setUserOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    const accessToken = localStorage.getItem("accessToken");

    const getUserOrders = async () => {
        if (!accessToken) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get("https://electromart-backend-sand.vercel.app/api/v1/order/getMyorders", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (res.data.success) {
                setUserOrder(res.data.orders);
            }
        } catch (error) {
            console.error("Fetch Error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserOrders();
    }, []);


    return (
        <div className="mt-[-70px]">
            <OrderCard loading={loading} userOrder={userOrder} />
        </div>
    );
};

export default MyOrders;