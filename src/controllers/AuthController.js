/*import userModel from "../models/User.js";
import Jwt from "jsonwebtoken";

const secret_Key = "greenwebsolutions";

export async function loginWithGoogle(req, res) {
  const userProfile = req?.user;
  const isUser = await userModel.findOne({ id: userProfile?.id });
  const user = {
    id: userProfile?.id,
    name: userProfile?.displayName,
    email: userProfile?.emails[0]?.value,
    profilePhotoURL:userProfile?.photos[0]?.value
  };

  if (!isUser) {
    const newUser = new userModel(user);
    const savedUser = await newUser.save();
    const token = generateAccessToken({...savedUser});
    return res.send({token});
  }
   const token = generateAccessToken({...isUser});
    return res.json({token});
}



const generateAccessToken = (data) => {
  try {
    const token = Jwt.sign(data, secret_Key, {
      expiresIn: "30d",
    });
    return token;
  } catch (e) {
    console.log(e.message);
  }
}*/
