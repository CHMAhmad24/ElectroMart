import express from 'express'
import { register, verify, reVerify, login, logout, forgotPassword, verifyOTP, changePassword, allUsers, getUserById, updateUser, toggleSubscription } from '../controllers/userController.js';
import { isAuthenticated, isAdmin } from '../Middlewares/isAuthenticated.js';
import { singleUpload } from '../Middlewares/multer.js';

const router = express.Router()

router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerify)
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)

router.post('/forgotPassword', forgotPassword)
router.post('/verifyOTP/:email', verifyOTP)
router.post('/changePassword/:email', changePassword)

router.get('/getUserById/:id', getUserById)
router.get('/allUsers', isAuthenticated, isAdmin, allUsers)

router.put('/update/:id', isAuthenticated, singleUpload, updateUser)
router.put('/subscription/:id', isAuthenticated, toggleSubscription)

export default router;
