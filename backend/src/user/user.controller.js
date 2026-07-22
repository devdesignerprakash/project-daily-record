import UserService from "./user.service.js";

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ message: 'Users fetched successfully', data: users });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const creatorId = req.user?.id;
      const user = await UserService.createUser({ ...req.body, createdBy: creatorId });
      res.status(201).json({ message: 'User created successfully', data: user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.updateUser(id, req.body);
      res.status(200).json({ message: 'User updated successfully', data: user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default UserController;
