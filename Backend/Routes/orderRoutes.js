import express from "express";
import { placeOrder, getMyOrder, updateStatus, getUserOrders, getAllOrders, getSalesData } from "../controllers/orderController.js";
import { isAuthenticated, isAdmin } from "../Middlewares/isAuthenticated.js";

const router = express.Router();

// ================= USER =================
router.post("/place", isAuthenticated, placeOrder);
router.get("/getMyorders", isAuthenticated, getMyOrder);

// ================= ADMIN =================
router.get("/all", isAuthenticated, isAdmin, getAllOrders);
router.get("/userOrder/:userId", isAuthenticated, isAdmin, getUserOrders);

router.put("/status", isAuthenticated, isAdmin, updateStatus);

router.get("/sales", isAuthenticated, isAdmin, getSalesData)

export default router;
