import express from 'express';
import { authenticLoginController, facebookLoginController, getUnlockLevels, getUserController, getdetailController, guestLoginController, referAndEarnController,kycController,getCompletedChallengesController } from '../controllers/UserController.js';
import { checkUserLogin } from '../middleware/middlewares.js';
import upload from '../middleware/upload.js';
import { updateBallController, updateCoinController, updateUserController } from '../controllers/UpdateController.js';
const userRouter = express.Router();

userRouter.post('/userlogin',authenticLoginController);
userRouter.post('/guestlogin',guestLoginController);
userRouter.post('/facebookLogin',facebookLoginController);
userRouter.get('/get',checkUserLogin , getUserController);
userRouter.post('/updateCoins',checkUserLogin,updateCoinController);
userRouter.post('/updateBalls',checkUserLogin,updateBallController);
userRouter.post('/refer',checkUserLogin,referAndEarnController);
userRouter.get("/unlockLevelCount",checkUserLogin,getUnlockLevels);
userRouter.get('/updateUser',checkUserLogin,updateUserController);
userRouter.get('/getdetails',getdetailController);
userRouter.get('/getcompletedChallenge',checkUserLogin,getCompletedChallengesController)
// userRouter.post('/kyc',checkUserLogin,upload.array('files'),kycController)
userRouter.post(
    '/kyc',
    checkUserLogin,
    upload.fields([
      { name: 'adharFront', maxCount: 1 },
      { name: 'adharBack', maxCount: 1 },
      { name: 'panFront', maxCount: 1 }
    ]),
    kycController
  );
export default userRouter;