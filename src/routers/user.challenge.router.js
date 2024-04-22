import express from 'express';
import { checkUserLogin } from '../middlewares/middlewares.js';
import {insertChallengeController,getAllChallengeController,updateChallengeController} from './controllers/challenge.comtroller.js'

const  challengeRouter = express.Router()

challengeRouter.post('/insertChallenge',checkUserLogin,insertChallengeController)
challengeRouter.get('/getChallenge',checkUserLogin,getAllChallengeController)
challengeRouter.put('/updateChallenge', checkUserLogin,updateChallengeController)