import express from "express";
import { insertVersionController } from "../controllers/versionController.js";


const versionRouter = express.Router();


versionRouter.post("/insert",insertVersionController);

export default versionRouter;