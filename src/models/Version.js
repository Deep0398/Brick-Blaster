import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true
      }

},{timestamps:true})

 const  versionModel =  mongoose.model('version',versionSchema);

 export default versionModel;