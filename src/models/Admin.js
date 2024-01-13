import mongoose from "mongoose"


const adminSchema = mongoose.Schema({
    
    username:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String,required:true},
    
});

const adminModel = mongoose.model('admin',adminSchema);
export default adminModel;