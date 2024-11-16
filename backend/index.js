const express = require('express');
const { default: mongoose } = require('mongoose');
const { createServer } = require('node:http');
const {join} =require('node:path')
const cors = require("cors");
const { Socket } = require('socket.io');
const userRoute=require("./routers/userRoute")

require("dotenv").config();

//express initalizes app to be a function handler that you can supply to an HTTP server
const app = express();
const server = createServer(app);

const port = process.env.PORT || 5000;
const io = require('socket.io')(server)//io is a socket.io server

//MIDDLEWARE
const corsOptions= {
    origin: "http://localhost:3000", //URL for the frontend
    method: ["GET","POST"],
}
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/users", userRoute);

app.get('/', (req,res)=>{
    res.send("Server is running");
});

//socket connection
// io.on listens to the server events
io.on("connection", (socket) =>{ //socket argument is an object that represents an incoming socket connection from a client
    const sessionID= socket.id
    console.log(`user connected : ${sessionID}`);
    //socket.on listens to events on that connected socket
    socket.on('send_message',(data)=>{
        socket.broadcast.emit('message: '+ data);
    })
})

//connect mongoDB
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(()=>{
    //start server
    server.listen(port, ()=>{
        console.log(`Listening on port ${port}`);
    });})
    .catch(err =>{ //error handling
    console.log(err);
})

