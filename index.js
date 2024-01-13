import express from "express";
import session  from 'express-session';
/*import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';*/
import  passport  from "passport";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./src/config/configDB.js";
import dotenv from "dotenv";
/*import authRouter from "./src/routers/AuthRouter.js";*/
import achievementRouter from "./src/routers/AchievementRouter.js";
import userRouter from "./src/routers/UserRouter.js";
import levelRouter from "./src/routers/LevelRouter.js";
import adminRouter from "./src/routers/AdminRouter.js";
import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";


const app = express();


app.set('view engine','ejs');
dotenv.config();
connectDB();
app.use(morgan("common"));
app.use(cors());
app.use(express.json());
app.use(session({resave: false,saveUninitialized: true,secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session());

  const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIAL;
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "adminpushnotification-376e4",
    });
/*var userProfile;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
    
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));


passport.serializeUser(function(user, cb) {cb(null, user);});
passport.deserializeUser(function(obj, cb){ cb(null, obj);});


app.get('/',(req,res)=>{res.render('auth')})
app.use('/auth',authRouter);*/
app.use('/achievement',achievementRouter);
app.use('/user',userRouter);
app.use('/level',levelRouter);
app.use('/admin',adminRouter)
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0',() => {
  
});