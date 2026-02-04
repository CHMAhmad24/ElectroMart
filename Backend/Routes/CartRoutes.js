import express from 'express'
import { isAuthenticated } from '../Middlewares/isAuthenticated.js';
import { addToCart, getCart, removeQuantity, updateQuantity } from '../controllers/cartController.js';

const router = express.Router()

router.get('/', isAuthenticated, getCart)
router.post('/add',isAuthenticated, addToCart)
router.put('/update', isAuthenticated, updateQuantity)
router.delete('/remove',isAuthenticated, removeQuantity)

export default router;