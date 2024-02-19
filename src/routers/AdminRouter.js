import express from 'express';

import { adminLoginController, adminSignupController, deleteAllUsers, getAllUsersController } from '../controllers/AdminController.js';
import { checkAdminLogin } from '../middleware/middlewares.js';


const adminRouter = express.Router();

adminRouter.post('/register',adminSignupController)
adminRouter.post('/login',adminLoginController);
adminRouter.get('/retrieveall',checkAdminLogin,getAllUsersController)
adminRouter.delete('/delete',checkAdminLogin,deleteAllUsers);

export default adminRouter;