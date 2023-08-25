const express = require('express')
const router = express.Router()
const registerRouter = require('./register')
const authRouter = require('./auth')
 const authMiddleware = require('../middleware/autorization')
const userRouter = require('./users')
const adminRouter = require('./admin')
const productRouter = require('./products')

router.use('/register', registerRouter)

router.use('/products', productRouter)
router.use('/auth', authRouter)

router.use(authMiddleware)
router.use('/users', userRouter)
router.use('/admin', adminRouter)

module.exports = router