import mongoose from "mongoose";
import { user as User } from "./userModel.js";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products:[
        {
            productId:{type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            quantity: { type: Number, required: true}
        }
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    currency: { type: String, default: "$" },
    status: { type: String, enum: ["Pending", "Paid", "Cancelled"], default: "Pending" },
    paymentMethod: { type: String, default: "COD" },
    payment: { type: Boolean, default: false }, // false because COD
    date: { type: Number, required: true },
},{ timestamps: true });

export const Order = mongoose.model("Order", orderSchema);