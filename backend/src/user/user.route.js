import express from 'express';
import UserController from './user.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import authorizedUser from '../middleware/authorizedUser.js';

const userRouter = express.Router();

// Only admin can perform user management actions
userRouter.get('/', verifyToken, authorizedUser('admin'), UserController.getAllUsers);
userRouter.post('/', verifyToken, authorizedUser('admin'), UserController.createUser);
userRouter.put('/:id', verifyToken, authorizedUser('admin'), UserController.updateUser);

export default userRouter;
