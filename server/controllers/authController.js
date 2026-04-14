import bcrypt from 'bcrypt'
import {findUserbyEmail} from '../models/userModel.js'
import {createUser} from '../models/userModel.js'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

// @ts-ignore
export  const  register=async (req,res)=>{
    const {name,email,password}=req.body;
    try{
       const userInfo=await findUserbyEmail(email)
       // @ts-ignore
       if(userInfo.length>0){
        res.status(400).json({message:"User already exists"})

       }
       const salt=10
       const hashedPassword=await bcrypt.hash(password,salt)
       const role='user'
       const result=await createUser(name,email,hashedPassword,role);
       if(result)res.status(201).json({message:"User created succesfully",
        // @ts-ignore
        userId:result.insertId
       })
    }catch(err){
        res.json({message:"error from authController.register",
            error:err

        })
    }

    

}

export const login=async(req,res)=>{
    const {email,password}=req.body
    try{
        if(!email||!password){res.status(400).json({message:"enter credentials"})}
     const queryResult=await findUserbyEmail(email)
     // @ts-ignore
     if(!queryResult.length){res.status(400).json({message:"Invalid email or password"})}
    // @ts-ignore
    const user=queryResult[0];
   
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)res.status(401).json({message:"Wrong password"})
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
        res.status(500).json({message:"error thrown from db at authController.login",
            error:err
        })
    }
}
    
