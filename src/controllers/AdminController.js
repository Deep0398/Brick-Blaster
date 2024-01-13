import adminModel from "../models/Admin.js"
import userModel from "../models/User.js";
import { getMessaging } from "firebase-admin/messaging";
import bcrypt from 'bcrypt'
import { generateAccessToken } from "../services/generateAccessToken.service.js";
import { error, success } from "../utills/responseWrapper.utills.js";

export async function adminSignupController(req,res){
    try {
        const {username,password,email} = req.body;
        if(!username || !password || !email){
            return res.send({message:"all fields are required"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        req.body["password"] = hashedPassword;
        const user = await adminModel.create(req.body);
        const  newuser = await adminModel.findById(user._id);
        return res.send({newuser});

    } catch (error) {
        return res.send({'error':error.message});
    }

}
export async function adminLoginController(req,res){
  try {
    
    const {username,password} = req.body;
    const user = await adminModel.findOne({
        $or:[{username:username}, {password:password}]
    });
    if(!user){
        return res.status(404).json({message:"user not found"});
    }

    const matched = await bcrypt.compare(password,user.password);
    if(!matched){
        return res.send({message:"incorrect password"});
    }

    const accessToken = generateAccessToken({...user})
    
    delete user['_doc']['password'];
    delete user['_doc']['__v'];
    delete user._doc['_id'];
   

    return res.send({...user._doc,"accessToken":accessToken});
    
} catch (error) {
    return res.json({"error":error.message});
}


}


export async function getAllUsersController(req,res){
  try {
      const users = await userModel.find({}).populate('achivements').populate('levels');
      return res.send(success(200,users));
  } catch (err) {
      return res.send(error(500,err.message));
  }
}
export async function searchUserController (req, res)  {
  try {
    const searchTerm = req.query.term;

    
    const users = await userModel.find({ name: { $regex: new RegExp(searchTerm, 'i') } });

    res.json(users);
  } catch (error) {
   
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export async function  fcmTokenController  (req,res)  {
  
        
  const { _id } = req.params;
  const { fcmToken } = req.body;
try {
const user = await userModel.findById( _id );

if (!user) {
  return res.status(404).json({ error: 'User not found' });
}


console.log('FCM Token:', fcmToken);
user.fcmToken = fcmToken;


await user.save();

res.json({ message: 'FCM token added successfully' });

} catch (error) {

res.status(500).json({ error: 'Internal server error' })
}

}


export async function sendNotificationController (req,res) {
  try {
      const { _id } = req.params;
      const { title, body } = req.body;
  
     
      const user = await userModel.findById(_id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      if (!user.fcmToken ) {
        return res.status(400).json({ error: 'User does not have FCM tokens' });
      }
  
     
      const fcmToken = user.fcmToken;
  
      
      const message = {
        notification: {
          title: title || 'Default Title',
          body: body || 'Default Body',
        },
        token: fcmToken,
      };
  
      
      const response = await getMessaging().send(message);
  
      
      res.status(200).json({ message: 'Successfully sent message', token: fcmToken });
    } catch (error) {
      
      res.status(500).json({ error: 'Internal server error' });
    }
}

export async function sendNotificationToAllController (req,res) {
  try {
      const { title, body } = req.body;
  
     
      const users = await userModel.find();
  
      if (!users || users.length === 0) {
        return res.status(404).json({ error: 'No users found' });
      }
  
     
      for (const user of users) {
       
        if (user.fcmToken ) {
         
          const fcmToken = user.fcmToken;
  
          
          const message = {
            notification: {
              title: title || 'Default Title',
              body: body || 'Default Body',
            },
            token: fcmToken,
          };
  
          
          const response = await getMessaging().send(message);
  
          
        }
      }
  
      res.status(200).json({ message: 'Successfully sent messages to all users' });
    } catch (error) {
      
      res.status(500).json({ error: 'Internal server error' });
    }
}


