import versionModel from "../models/Version.js";
import {error,success} from "../utills/responseWrapper.utills.js";

export async function insertVersionController(req,res){
    console.log("pavan");
    const {version} = req.body
    try {
        const existingVersion = await versionModel.findOne({version});
        if (existingVersion){
            return res.send(error(409,{isNewVersion:false}));
        }
      const newVersion = await versionModel.create({version});
      console.log(newVersion);
      return res.send(success(200,{isNewVersion:true}));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}

