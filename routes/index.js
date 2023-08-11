const express = require('express')
const router = express.Router()
const registerRouter = require('./register')
const authRouter = require('./auth')
 const authMiddleware = require('../middleware/autorization')
const userRouter = require('./users')

router.use('/register', registerRouter)

router.use('/auth', authRouter)

router.use(authMiddleware)
router.use('/users', userRouter)

module.exports = router