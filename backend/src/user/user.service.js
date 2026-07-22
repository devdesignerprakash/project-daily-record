import User from "./user.schema.js";

class UserService {
  static async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  static async getUserByEmail(email) {
    const user = await User.findOne({ email });
    return user; // Return null if not found (don't throw so we can check existence)
  }

  static async getAllUsers() {
    try {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  static async createUser(data) {
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error('Email is already registered');
      }
      const newUser = await User.create(data);
      // Remove password from returned object
      const userObj = newUser.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      console.error("Error creating user in service:", error);
      throw error;
    }
  }

  static async updateUser(id, data) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      // Check email uniqueness if email is changing
      if (data.email && data.email !== user.email) {
        const emailExists = await User.findOne({ email: data.email });
        if (emailExists) {
          throw new Error('Email is already registered by another user');
        }
        user.email = data.email;
      }

      if (data.fullName) user.fullName = data.fullName;
      if (data.designation) user.designation = data.designation;
      if (data.userType) user.userType = data.userType;
      
      if (data.password) {
        user.password = data.password; // Mongoose pre-save hook will hash it
      }

      await user.save();
      
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      console.error("Error updating user in service:", error);
      throw error;
    }
  }
}

export default UserService;