import express from 'express';
import {postLevelController,getLevelController,updateLevelController, getAllLevelsController, postAllLevelController} from '../controllers/LevelController.js';
import { checkUserLogin } from '../middleware/middlewares.js';

const levelRouter = express.Router();
levelRouter.post('/insert',checkUserLogin,postLevelController);
levelRouter.post('/insertall',checkUserLogin,postAllLevelController);
levelRouter.get('/retrieve/:levelNo',checkUserLogin, getLevelController);
levelRouter.patch('/update/:levelNo',checkUserLogin,updateLevelController);
levelRouter.get('/retrievealllevel/',checkUserLogin, getAllLevelsController);

export default levelRouter;