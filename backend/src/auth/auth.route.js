import express from 'express'
import AuthController from './auth.controller.js'
import authorizedUser from '../middleware/authorizedUser.js'
import verifyToken from '../middleware/verifyToken.js'

const authRouter=express.Router()
authRouter.post('/login',AuthController.login)
authRouter.post('/register',verifyToken,authorizedUser('admin'),AuthController.register)


export default authRouter