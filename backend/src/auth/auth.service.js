import User from "../user/user.schema.js";
import UserService from "../user/user.service.js";
import bcrypt from "bcryptjs";

 class AuthService {
   static async register(data) {
        const newUser = await User.create(data);
        return newUser;
    }
    static async login(email, password) {
       const user= await UserService.getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }
        return user;
    }

}

export default AuthService;