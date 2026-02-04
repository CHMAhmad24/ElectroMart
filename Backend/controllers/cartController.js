import { Cart } from "../Models/cartModel.js"
import { Product } from "../Models/productModel.js"

export const getCart = async (req, res) => {
    try {
        const userId = req.id
        const cart = await Cart.findOne({ userId }).populate("items.productId")
        if (!cart) {
            return res.json({
                success: true,
                cart: []
            })
        }
        res.status(200).json({
            success: true,
            cart
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity"
            });
        }

        // Check if product exists
        const product = await Product.findById(productId)
        if (!product || !quantity || quantity < 1) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }

        // Find the user's cart if exist
        let cart = await Cart.findOne({ userId })

        // If cart does'nt exists, create a new one
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity, price: product.productPrice }],
                totalPrice: product.productPrice * quantity
            })
        } else {
            // Find if product is already in the cart
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            )
            if (itemIndex > -1) {
                // If product Exists -> just increase quantity
                cart.items[itemIndex].quantity += quantity
            } else {
                // If new product push to Cart
                cart.items.push({
                    productId,
                    quantity,
                    price: product.productPrice,
                })
            }
            // Recalculate total price
            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + item.price * item.quantity, 0
            )
        }
        //save updated Cart
        await cart.save()

        // Populate product details before sending response
        const populatedCart = await Cart.findById(cart._id).populate("items.productId")
        res.status(200).json({
            success: true,
            message: "Produt Added To Cart Successfully",
            cart: populatedCart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id
        const { productId, type } = req.body

        let cart = await Cart.findOne({ userId })
        if (!cart) { return res.status(404).json({ success: false, message: "Cart Not Found" }) }

        const item = cart.items.find(item => item.productId.toString() === productId)
        if (!item) { return res.status(404).json({ success: false, message: "Item Not Found" }) }
        if (type === "increase") item.quantity += 1
        if (type === "decrease" && item.quantity > 1) item.quantity -= 1

        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
        await cart.save()
        cart = await cart.populate("items.productId")
        res.status(200).json({
            success: true,
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const removeQuantity = async (req, res) => {
    try {
        const userId = req.id
        const { productId } = req.body

        let cart = await Cart.findOne({ userId })

        if (!cart) { return res.status(404).json({ success: false, message: "Cart Not Found" }) }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId)
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

        cart = await cart.populate("items.productId")

        await cart.save()

        res.status(200).json({
            success: true,
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}