import express from "express"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.get('/',(req,res)=>{
    res.send("JWT AUTH SYSTEM")
})
const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
      console.log(`Server is running on port ${PORT}`)

})
