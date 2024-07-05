import express from 'express';

import { adminLoginController, adminSignupController,updateWithdrawRequestStatus, deleteAllUsers,getWithdrawRequestsByUserId, getAllUsersController,createChallengeController,updateChallengeController,deleteChallengeController,getKycController,updateKycStatusContoller,getAllWithdrawRequest} from '../controllers/AdminController.js';
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
adminRouter.put('/updatekycstatus/:userId',checkAdminLogin,updateKycStatusContoller)
adminRouter.get('/getallwithdrawrequest',checkAdminLogin,getAllWithdrawRequest)
adminRouter.get('/getwithdrawrequestbyUser/:userId',checkAdminLogin,getWithdrawRequestsByUserId)
adminRouter.patch('/withdraw-requests/:requestId',checkAdminLogin,updateWithdrawRequestStatus)
export default adminRouter;