export const authorize=(req,res,next)=>{
if(req.user.role!=='admin')return res.statue(403).json({ message: "Forbidden" })
  next()
}