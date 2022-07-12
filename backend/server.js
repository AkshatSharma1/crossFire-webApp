const express = require('express');
const { connect } = require('mongoose');
const connectDB = require('./config/db.js');
const dotenv = require('dotenv')
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require('./middlewares/errorMiddleware.js');
const multer = require("multer");
const fs = require('fs');
const {protect} = require("./middlewares/authMiddleware")
const path = require('path')


const PORT = process.env.PORT || 5000;

dotenv.config({ path: require('find-config')('.env') });

// console.log(process.env.MONGO_URL)

//connect to db
connectDB();
const app = express();

app.use(express.json()) //to get data from frontend

//Dev mode
// app.get("/", (req, res)=>{
//   res.send("API is running")
// })

// app.get("/chats")

app.use("/api/user", userRoutes)
app.use('/api/chat', chatRoutes); //chat api
app.use("/api/message", messageRoutes); //message route
app.use('/uploads', express.static('uploads'));

// const cors = require('cors');
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));


//multer image upload
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb){
    cb(null, `${Date.now()}_${file.originalname}`)
  },

  fileFilter: (req, file, cb)=>{
    const ext = path.extname(file.originalname);

    if(ext!=='.jpg' && ext!=='.png' && ext!=='.mp4'){
      return cb(res.status(400).end('Only jpg, png, mp4 formats are allowed'), false);
    }
    cb(null, true);
  }
})

var upload = multer({storage: storage}).single("file")

app.post("/api/chats/uploadfiles",protect, (req, res)=>{
  upload(req, res, err=>{
    if(err){
      console.log(err)
      return res.json({success: false, err})
    }

    return res.json({success: true, url: res.req.file.path})
  });
} )

/* ---------------- Deployment -----------*/

const __dirname1 = path.resolve()
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1, '/frontend/build')))
  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname1, "frontend","build","index.html"))
  })

}
else{
  app.get("/", (req, res)=>{
    res.send("API is running")
})
}

/* ----------------- Deploymemt -----------*/

//error handling if no route available
app.use(notFound);
app.use(errorHandler)

//listen
const server = app.listen(PORT, console.log("Server started"))
//socket.io
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    console.log(socket.id)
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.emit('me', socket.id) //video
    socket.on('disconnect',()=>{
      socket.broadcast.emit('callEnded')
    });

    socket.on("callUser", (data)=>{
      io.to(data.userToCall).emit("callUser", {signal: data.signalData, from: data.from, name: data.name});
    })

    socket.on("answerCall", (data)=>{
      io.to(data.to).emit('callAccepted', data.signal)
    })
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });