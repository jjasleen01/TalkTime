import { generateToken } from "../Lib/utils.js";
import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import cloudinary from "../Lib/cloudinary.js";

//signup a new user
export const signUp = async(req, res)=>{
    const {fullName, email, password, bio} = req.body;
    try{
        if(!fullName || !email || !password || !bio){ 
            return res.json({success: false, message: "Missing Details"});
        }
        const user = await User.findOne({email});

        //user found
        if(user){
            return res.json({success: false, message: "Account already exists!"});
        }

        //user not exists
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creating a user

        const newUser = await User.create({fullName, email, password: hashedPassword, bio});

       const token = generateToken(newUser._id);

       res.json({success: true, userData: newUser, token, message: "Account created successfully!"});

    }catch(err){
        console.log(err.message);
        res.json({success: false,message: err.message });
    }
}

//controller to login a user
export const login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
           return res.json({success: false, message: "Invalid credentials"});
        }

        //password correct
        const token = generateToken(userData._id);
        res.json({success: true, userData, token, message: "Login successful!"});
    }catch(err){
        console.log(err.message);
        res.json({success: false,message: err.message });
    }
    
}

//controller to update user profile details
export const updateProfile = async (req, res)=>{
    try{
        const {profilePic, bio, fullName} = req.body;
        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new:true});
        }else{//profile pic provided
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new:true});
        }
        res.json({success: true, user: updatedUser});
    }catch(err){
        console.log("Cloudinary error details:", err); 
        console.log("Error message:", err.message); 
        console.log("HTTP status:", err.http_code);
        res.json({success: false, message: err.message});
    }
}

//controller to check if user is authenticated (called by next()) ~ returns the user to the frontend
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}