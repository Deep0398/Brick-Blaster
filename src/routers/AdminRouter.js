import express from 'express';

import { adminLoginController, adminSignupController, fcmTokenController, getAllUsersController, searchUserController, sendNotificationController, sendNotificationToAllController } from '../controllers/AdminController.js';
import { checkAdminLogin } from '../middleware/middlewares.js';


const adminRouter = express.Router();

adminRouter.post('/register',adminSignupController)
adminRouter.post('/login',adminLoginController);
adminRouter.get('/retrieveall',checkAdminLogin,getAllUsersController)
adminRouter.get('/search',checkAdminLogin,searchUserController)
adminRouter.post('/add-fcm-token/:_id',checkAdminLogin,fcmTokenController);
adminRouter.post('/send-notification/:_id',checkAdminLogin,sendNotificationController)
adminRouter.post('/send-notification-to-all',checkAdminLogin,sendNotificationToAllController)

export default adminRouter;