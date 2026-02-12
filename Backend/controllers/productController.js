import { Product } from "../Models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { sendNewProductNotification } from '../Email_Verify/sendNewProductNotification.js';
import { user as User } from '../Models/userModel.js';

export const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body
        const userId = req.id

        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //Handle multiple images upload

        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "emart_products"        // cloudinary products folder name
                })
                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        // Create a product in DB
        const newProduct = await Product.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg, //Array of objects [{url, public_id},{url, public_id}]
        })
        const subscribers = await User.find({ isSubscribed: true }).select('email');
        const subscriberEmails = subscribers.map(u => u.email);
        if (subscriberEmails.length > 0) {
            // 2. Trigger the email utility (don't 'await' if you don't want to slow down the response)
            sendNewProductNotification(subscriberEmails, newProduct).catch(err => 
                console.error("Subscription Email Error:", err)
            );
        }
        return res.status(200).json({
            success: true,
            message: 'Product Added Successfully',
            product: newProduct
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllProducts = async (_, res) => {
    try {
        const products = await Product.find()
        if (!products) {
            return res.status(404).json({
                success: false,
                message: 'No Product available',
                products: []
            })
        }
        return res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // Delete Images From Cloudinary

        if (product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                const result = await cloudinary.uploader.destroy(img.public_id);
            }
        }

        // Delete Product from mongoDB

        await Product.findByIdAndDelete(productId);
        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        let updatedImages = [...product.productImg]; // start with all images

        if (existingImages !== undefined) {
            const keepIds = JSON.parse(existingImages);

            // Only run deletion if the user actually selected images to keep
            if (keepIds.length > 0) {
                // Keep selected images
                updatedImages = product.productImg.filter(img =>
                    keepIds.includes(img.public_id)
                );

                // Delete removed images
                const removedImages = product.productImg.filter(img =>
                    !keepIds.includes(img.public_id)
                );

                for (let img of removedImages) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
            // If keepIds is empty, do nothing (means user didn’t touch images)

        } else {
            updatedImages = product.productImg // keep all if nothing sent
        }

        // Upload New images if any
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, { folder: "emart_products" })
                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        product.productName = productName || product.productName
        product.productDesc = productDesc || product.productDesc
        product.productPrice = productPrice || product.productPrice
        product.category = category || product.category
        product.brand = brand || product.brand
        product.productImg = updatedImages

        await product.save()

        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

