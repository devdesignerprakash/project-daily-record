import generateToken from "../../utils/generateToken.js";
import AuthService from "./auth.service.js";
import UserService from "../user/user.service.js";

const stripPassword = (userDoc) => {
    const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
    delete obj.password;
    return obj;
};

const COOKIE_OPTIONS = { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'strict' };

class AuthController{
    static async login(req,res){
        try{
            const {email,password}=req.body
            const user=await AuthService.login(email,password)
            const payload={id:user?._id,email:user?.email, role:user?.userType, allowedModules:user?.allowedModules}
            const token= generateToken(payload)
            res.cookie('token',token,COOKIE_OPTIONS)
            res.status(200).json({message:'Login successful',user: stripPassword(user)})
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
            res.cookie('token',token,COOKIE_OPTIONS)
            res.status(201).json({message:'User registered successfully',user: stripPassword(user)})
        }catch(error){
            res.status(400).json({message:error.message})
        }
    }

    static async me(req,res){
        try{
            const user = await UserService.getUserById(req.user.id)
            res.status(200).json({message:'Current user fetched successfully',user: stripPassword(user)})
        }catch(error){
            res.status(404).json({message:error.message})
        }
    }

    static async logout(req,res){
        res.clearCookie('token', COOKIE_OPTIONS)
        res.status(200).json({message:'Logged out successfully'})
    }
}
export default AuthController;