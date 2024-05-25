import express from 'express'
import { login, register, resendotp, verifyEmail } from '../controller/authController.js'
import { VerifyToken } from '../utils/token.js'


const authRouter = express.Router()

authRouter.post('/signup',register)
authRouter.post('/login',login)
authRouter.post('/verifyemail',VerifyToken,verifyEmail)
authRouter.post('/resendOtp',resendotp)

export default authRouter


