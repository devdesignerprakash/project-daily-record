import generateToken from "../../utils/generateToken.js";
import AuthService from "./auth.service.js";

class AuthController{
    static async login(req,res){
        try{
            const {email,password}=req.body
            const user=await AuthService.login(email,password)
            const payload={id:user?._id,email:user?.email, role:user?.userType}
            const token= generateToken(payload)
            res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:'strict'})
            res.status(200).json({message:'Login successful',user})
        }catch(error){
            res.status(400).json({message:error.message})
        }
    }

    static async register(req,res){
        try{
            const {fullName,email,designation,password}=req.body
            const user=await AuthService.register({fullName,email,designation,password})
            const payload={id:user._id,email:user.email}
            const token= generateToken(payload)
            res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:'strict'})
            res.status(201).json({message:'User registered successfully',user})
        }catch(error){
            res.status(400).json({message:error.message})
        }
    }
}
export default AuthController;