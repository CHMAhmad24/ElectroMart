import mongoose from "mongoose";
import { Order } from "../Models/orderModel.js";
import { user as User } from "../Models/userModel.js";
import { Cart } from "../Models/cartModel.js";
import { Product } from "../Models/productModel.js";
// ================= PLACE ORDER (COD ONLY) =================
export const placeOrder = async (req, res) => {
    try {
        const userId = req.id;
        const { products, amount, tax, shipping, address } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: "No products provided" });
        }

        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Sorry, only ${product.stock} units of ${product.productName} left in stock.`
                });
            }
        }

        const stockUpdates = products.map(item => ({
            updateOne: {
                filter: { _id: item.productId },
                update: { $inc: { stock: -item.quantity } } // Stock kam kar rahe hain
            }
        }));

        await Product.bulkWrite(stockUpdates);

        const formattedProducts = products.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        // 1. Order Save Karein (According to new Schema)
        const newOrder = new Order({
            user: userId,
            products: formattedProducts,
            amount, // Total amount (including tax & shipping)
            address,
            tax: tax || 0,
            shipping: shipping || 0,
            currency: "$",
            status: "Pending", // Match with enum ["Pending", "Paid", "Cancelled"]
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        });

        await newOrder.save();

        // 2. Database mein Cart empty karein
        await Cart.findOneAndUpdate(
            { userId: userId },
            { items: [], totalPrice: 0 }
        );

        res.status(201).json({ success: true, message: "Order Placed Successfully", order: newOrder });

    } catch (error) {
        console.error("Place Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= USER ORDERS =================
export const getMyOrder = async (req, res) => {
    try {
        const userId = req.id;

        const orders = await Order.find({
            user: new mongoose.Types.ObjectId(userId)
        })
            .populate({
                path: "user",
                model: User, // Yahan hum direct model reference pass kar rahe hain
                select: "firstName lastName email"
            })
            .populate({
                path: "products.productId",
                model: "Product", // Explicitly telling Mongoose to use 'Product' model
                select: "productName productPrice productImg"
            })
            .sort({ date: -1 });

        res.status(200).json({ success: true, count: orders.length, orders });

    } catch (error) {
        console.error("Populate Error Fix:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= ADMIN: ALL ORDERS =================
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId })
            .populate({
                path: "user",
                model: User, // <--- Use the imported 'User' variable here
                select: "firstName lastName email username"
            })
            .populate({
                path: "products.productId",
                model: "Product", // If Product fails, use the Product variable here too
                select: "productName productPrice productImg"
            })
            .sort({ date: -1 });
        res.status(200).json({ success: true, count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        // Double check: if User isn't registered, this line forces it
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                model: 'user',
                select: 'name email'
            })
            .populate("products.productId", "productName productPrice");

        res.status(200).json({ success: true, count: orders.length, orders });
    } catch (error) {
        console.error("Populate Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= ADMIN: UPDATE STATUS =================
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Validation for Enum
        const allowedStatus = ["Pending", "Paid", "Cancelled"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }
        
        if (status === "Cancelled") {
            const order = await Order.findById(orderId);
            if (order && order.status !== "Cancelled") {
                const stockRestores = order.products.map(item => ({
                    updateOne: {
                        filter: { _id: item.productId },
                        update: { $inc: { stock: item.quantity } } // Stock wapas badha diya
                    }
                }));
                await Product.bulkWrite(stockRestores);
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate( // Changed from orderModel
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order Status Updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({})
        const totalProducts = await Product.countDocuments({})
        const totalOrders = await Order.countDocuments({ status: "Paid" })

        // Total Sales Amount
        const totalSalesAgg = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },

        ])
        const totalSales = totalSalesAgg[0]?.total || 0;

        // Sales group  by Date (last 30 days)

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const salesByDate = await Order.aggregate([
            { $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "+05:00" }
                    },
                    amount: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } }
        ])

        const formattedSales = salesByDate.map((item) => ({
            date: item._id,
            amount: item.amount
        }))

        res.json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            sales: formattedSales
        })
    } catch (error) {
        console.error("Error Fetching Sales Data:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
