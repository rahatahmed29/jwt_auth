import express from 'express'
import {login, refresh, register} from '../controllers/authController.js'

const authRouter=express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/refresh',refresh)