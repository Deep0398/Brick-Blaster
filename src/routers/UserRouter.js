import express from 'express';
import { authenticLoginController, getUserController, guestLoginController } from '../controllers/UserController.js';
import { checkUserLogin } from '../middleware/middlewares.js';
import { updateBallController, updateCoinController } from '../controllers/UpdateController.js';
const userRouter = express.Router();

userRouter.post('/userlogin',authenticLoginController);
userRouter.post('/guestlogin',guestLoginController);
userRouter.get('/get',checkUserLogin , getUserController);
userRouter.post('/updateCoins',checkUserLogin,updateCoinController);
userRouter.post('/updateBalls',checkUserLogin,updateBallController);



export default userRouter;