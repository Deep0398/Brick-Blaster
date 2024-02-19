import express from "express";
import { getVersionController, insertVersionController } from "../controllers/versionController.js";


const versionRouter = express.Router();


versionRouter.post("/insert",insertVersionController);
versionRouter.get('/get',getVersionController);

export default versionRouter;