import User from "../models/UserSchema.js";
import Message from "../models/MessageSchema.js";
import cloudinary from "../Lib/cloudinary.js";
import {io, userSocketMap} from "../server.js";

//get all users except login user
export const getUsersForSidebar = async (req, res)=>{
    try{
        const userId = req.user._id; //logged in user's id
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password"); //excluding your own

        //count number of unseen messages
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false});
            
            if(messages.length > 0){
            unseenMessages[user._id] = messages.length;
        }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages});
        
    }catch(err){
        console.log(err.message);
        res.json({succes: false, message: err.message});
    }
}

//get all messages for selected users
export const getMessages = async (req, res)=>{
    try{
        const {id: selectedUserId} = req.params; //id of user whose chat opened
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId}, 
                {senderId: selectedUserId, receiverId: myId}, 
                ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true}); //sender->receiver ~ seen

        res.json({success: true, messages});
    }catch(err){
        console.log(err.message);
        res.json({success: false, message: err.message});
    }
}

//api to mark messages as seen using message id
export const markMessageAsSeen = async (req, res)=>{
    try{
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen:true});
        res.json({success:true});

    }catch(err){
        console.log(err.message);
        res.json({succes: false, message: err.message}); 
    }
}

//send message to selected user
export const sendMessage = async (req, res)=>{
    try{
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uplaodResponse = await cloudinary.uploader.upload(image);
            imageUrl = uplaodResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl 
        }) //saved

        //emit the new msg to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        } //sends an event to that specific socket

        //new
        res.json({success: true, newMessage});

    }catch(err){
        console.log(err.message);
        res.json({succes: false, message: err.message}); 
    }
}