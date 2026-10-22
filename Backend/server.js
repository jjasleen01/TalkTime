import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import {connectDB} from "./Lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";


//create express app and server

const app = express();
const server = http.createServer(app);

//Inittialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

//store online users
export const userSocketMap = {}; //{userId: socketId }

//socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    if(userId) userSocketMap[userId] = socket.id;

//emit online users to all connected clients
    io.emit("getOnlineUsers", (Object.keys(userSocketMap)));

    socket.on("disconnect", ()=>{
    console.log("User disconnected");
    if (userId) {
        delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
})
})




//middleware setup
app.use(express.json({limit: "4mb"})); //img limit 4mb
app.use(cors());

//Routes setup
app.use("/api/status", (req, res)=>{
    res.send("server is live...");
})

//userRoutes
app.use("/api/auth", userRouter);

//msg Routes
app.use("/api/messages", messageRouter);

//connect to mongodbS
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`);
})