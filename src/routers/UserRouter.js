import express from 'express';
import { authenticLoginController, getUserController, guestLoginController } from '../controllers/userController.js';
import { checkUserLogin } from '../middleware/middlewares.js';
const userRouter = express.Router();

userRouter.post('/authLogin',authenticLoginController);
userRouter.post('/guestLogin',guestLoginController);
userRouter.get('/get',checkUserLogin , getUserController);



export default userRouter;