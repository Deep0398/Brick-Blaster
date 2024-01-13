import express from 'express';
import {postLevelController,getLevelController,updateLevelController, getAllLevelsController} from '../controllers/LevelController.js';
import { checkUserLogin } from '../middleware/middlewares.js';

const levelRouter = express.Router();
levelRouter.post('/insert',checkUserLogin,postLevelController);
levelRouter.get('/retrieve/:levelNo',checkUserLogin, getLevelController);
levelRouter.put('/update/:levelNo',checkUserLogin,updateLevelController);
levelRouter.get('/retrievealllevel/',checkUserLogin, getAllLevelsController);

export default levelRouter;