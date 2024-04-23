import express from "express";
import session  from 'express-session';
import morgan from "morgan";
import cors from "cors";
import connectDB from "./src/config/configDB.js";
import dotenv from "dotenv";
import achievementRouter from "./src/routers/AchievementRouter.js";
import userRouter from "./src/routers/UserRouter.js";
import levelRouter from "./src/routers/LevelRouter.js";
import adminRouter from "./src/routers/AdminRouter.js";
import versionRouter from "./src/routers/versionRouter.js";
import challengeRouter from "./src/routers/user.challenge.router.js";
import progressamountRouter from "./src/routers/progressamount.router.js";
//import { generateUniqueReferralCode } from "./src/services/generateReferalCode.js";




const app = express();



dotenv.config();
connectDB();
app.use(morgan("common"));
app.use(cors());
app.use(express.json());
app.use(session({resave: false,saveUninitialized: true,secret: 'SECRET'}));


  

app.use('/achievement',achievementRouter);
app.use('/user',userRouter);
app.use('/level',levelRouter);
app.use('/admin',adminRouter);
app.use('/version',versionRouter);
app.use('/challenge',challengeRouter)
app.use('/progressamount',progressamountRouter)
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0',() => {
    console.log(`server is running on ${port}`)
});