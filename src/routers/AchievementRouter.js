import { insertAchievementController, retrieveAchievementController, retrieveAllAchievementsController, updateAchievementController } from "../controllers/AchievementController.js";
import express from 'express';
import { checkUserLogin } from "../middleware/middlewares.js";

const achievementRouter = express.Router();

achievementRouter.get('/retrieve',checkUserLogin,retrieveAchievementController);
achievementRouter.get('/retrieveall',checkUserLogin,retrieveAllAchievementsController)
achievementRouter.post('/insert',checkUserLogin,insertAchievementController);
achievementRouter.put('/update',checkUserLogin,updateAchievementController);

export default achievementRouter;
