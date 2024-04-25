import express from 'express';
import { checkUserLogin } from '../middleware/middlewares.js';
import {insertChallengeController,getAllChallengeController,updateChallengeController,getCompletedChallengesController} from '../controllers/user.challenge.controller.js'

const  challengeRouter = express.Router()

challengeRouter.post('/insertChallenge',checkUserLogin,insertChallengeController)
challengeRouter.get('/getChallenge',checkUserLogin,getAllChallengeController)
challengeRouter.put('/updateChallenge', checkUserLogin,updateChallengeController)
challengeRouter.get('/getcompletedChallenge',checkUserLogin,getCompletedChallengesController)

export default challengeRouter;