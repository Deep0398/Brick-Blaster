import express from 'express';

import { adminLoginController, adminSignupController, getAllUsersController } from '../controllers/AdminController.js';
import { checkAdminLogin } from '../middleware/middlewares.js';


const adminRouter = express.Router();

adminRouter.post('/register',adminSignupController)
adminRouter.post('/login',adminLoginController);
adminRouter.get('/retrieveall',checkAdminLogin,getAllUsersController)


export default adminRouter;