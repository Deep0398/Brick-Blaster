/*import express from 'express';
import passport from 'passport';
import { loginWithGoogle } from '../controllers/AuthController.js';

const authRouter = express.Router();

authRouter.get('/google',    passport.authenticate('google', { scope : ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/error' }),loginWithGoogle);

export default authRouter;*/