import express from 'express';
import {insertProgressAmountController,resetProgressAmountController} from '../controllers/progressamount.controller.js';
import { checkUserLogin } from '../middleware/middlewares.js';

const progressamountRouter = express.Router();

progressamountRouter.post('/insertProgressAmount',checkUserLogin,insertProgressAmountController);
progressamountRouter.put('/resetProgressAmount',checkUserLogin,resetProgressAmountController);

export default progressamountRouter;