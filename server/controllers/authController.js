// @ts-nocheck
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {findUserbyEmail} from '../models/userModel.js'
import {createUser} from '../models/userModel.js'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
dotenv.config()
// @ts-ignore
export  const  register=async (req,res)=>{
    const {name,email,password}=req.body;
    try{
       const userInfo=await findUserbyEmail(email)
       // @ts-ignore
       if(userInfo.length>0){
        return res.status(400).json({message:"User already exists"})

       }
       const salt=10
       const hashedPassword=await bcrypt.hash(password,salt)
       const role='user'
       const result=await createUser(name,email,hashedPassword,role);
       if(result){return res.status(201).json({message:"User created succesfully",
        // @ts-ignore
        userId:result.insertId
       })}
    }catch(err){
        return res.json({message:"error from authController.register",
            error:err

        })
    }

    

}

export const login=async(req,res)=>{
    const {email,password}=req.body
    try{
        if(!email||!password){return res.status(400).json({message:"enter credentials"})}
     const queryResult=await findUserbyEmail(email)
     // @ts-ignore
     if(!queryResult.length){return res.status(401).json({message:"Invalid email or password"})}
    // @ts-ignore
    const user=queryResult[0];
   
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)return res.status(401).json({message:"Wrong password"})
       const accessToken=generateAccessToken(user)
    const refreshToken=generateRefreshToken(user)

        res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:false,
    sameSite:'strict'
        })
         res.json({
            message:"Login Successful",
            accessToken
        })

    }catch(err){
        return res.status(500).json({message:"error thrown from db at authController.login",
            
        })
    }
}
    
export const refresh=(req,res)=>{
    const refreshToken=req.cookies.refreshToken
    if(!refreshToken) return res.status(401).json({ message: "No refresh token" })
        try{
    const user=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)
    const newAccessToken=generateAccessToken({
        id:user.id,
        role:user.role
    })
    res.json({accessToken:newAccessToken})
    }catch(err){
        return res.status(403).json({message: "Invalid refresh token"})
    }
}