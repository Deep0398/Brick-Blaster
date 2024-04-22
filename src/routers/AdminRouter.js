import express from 'express';

import { adminLoginController, adminSignupController, deleteAllUsers, getAllUsersController,createChallengeController,updateChallengeController,deleteChallengeController,getKycController,updateKycStatusContoller} from '../controllers/AdminController.js';
import { checkAdminLogin } from '../middleware/middlewares.js';


const adminRouter = express.Router();

adminRouter.post('/register',adminSignupController)
adminRouter.post('/login',adminLoginController);
adminRouter.get('/retrieveall',checkAdminLogin,getAllUsersController)
adminRouter.delete('/delete',checkAdminLogin,deleteAllUsers);
adminRouter.post('/createChallenge',checkAdminLogin,createChallengeController);
adminRouter.put('/updateChallenge/:id',checkAdminLogin,updateChallengeController);
adminRouter.delete('/deleteChallenge/:id',checkAdminLogin,deleteChallengeController);
adminRouter.get('/getkyclist',checkAdminLogin,getKycController)
adminRouter.put('/updatekycstatus/:id',checkAdminLogin,updateKycStatusContoller)
export default adminRouter;