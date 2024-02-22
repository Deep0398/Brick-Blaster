import express from 'express';
import { authenticLoginController, getUnlockLevels, getUserController, guestLoginController, referAndEarnController } from '../controllers/UserController.js';
import { checkUserLogin } from '../middleware/middlewares.js';
import { updateBallController, updateCoinController } from '../controllers/UpdateController.js';
const userRouter = express.Router();

userRouter.post('/userlogin',authenticLoginController);
userRouter.post('/guestlogin',guestLoginController);
userRouter.get('/get',checkUserLogin , getUserController);
userRouter.post('/updateCoins',checkUserLogin,updateCoinController);
userRouter.post('/updateBalls',checkUserLogin,updateBallController);
userRouter.post('/refer',checkUserLogin,referAndEarnController);
userRouter.get("/unlockLevelCount",checkUserLogin,getUnlockLevels);


export default userRouter;