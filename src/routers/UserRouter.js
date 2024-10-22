import express from 'express';
import { deleteUserController,authenticLoginController, facebookLoginController, getUnlockLevels, getUserController, getdetailController, guestLoginController, updateInrController,referAndEarnController,kycController,withdrawcontroller} from '../controllers/UserController.js';
import { checkUserLogin } from '../middleware/middlewares.js';
import { getChallengeController } from '../controllers/user.challenge.controller.js';
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
userRouter.post('/withdraw',checkUserLogin,withdrawcontroller)
userRouter.put('/updateINR',checkUserLogin,updateInrController)
userRouter.get('/getChallenges',getChallengeController)
userRouter.delete('/delete/user/:id',deleteUserController)

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