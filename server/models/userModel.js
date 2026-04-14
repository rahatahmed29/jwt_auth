import db from '../config/db.js'
export const  findUserbyEmail=async (email)=>{
    try{
    const sql="SELECT * FROM users WHERE email=?"
    const [userArray]= await db.query(sql, [email])
    return userArray;
    }catch(err){
        console.error("Database query failed in userModel.findUserbyEmail: ",err)
        throw err;
    }
}
export const createUser=async (name,email,hashedPassword,role)=>{
    const sql='INSERT INTO users (name,email,password,role)VALUES(?,?,?,?)'
    const[result]=await db.query(sql,[name,email,hashedPassword,role])
    return result;
}

