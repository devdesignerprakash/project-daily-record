import jwt from 'jsonwebtoken'

const verifyToken=async (req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({message:'Access denied. No token provided.'})
    }
    // Verify the token (assuming you have a verifyToken function)
    try{
        const decoded= await jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }catch(error){
        res.status(400).json({message:'Invalid token.'})
    }
}
export default verifyToken   