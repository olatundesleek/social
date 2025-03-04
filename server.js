const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.routes");
const checkJson = require("./middleware/checkjson");
const http = require('http')
require("dotenv").config();
const app = express();
const cors = require('cors')
const { Server } = require('socket.io');

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*", // Allow your frontend to connect
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"], // Optional: If you're sending custom headers
    credentials: true // Optional: If you're using cookies or other credentials
  }
})
const onlineUsers = new Map()

io.on('connection', (socket) => {
  console.log(socket.id + ' connected');

  

  // Emit a message when the client connects
  io.emit('server message', socket.id + ' connected');

  socket.on('register',(username)=>{
    onlineUsers.set(username,socket.id)
  })
  //Listen for new chat messages
  socket.on('chatMessage', (msg) => {
    console.log('message received: ' + msg);
    
    // Emit the message to all connected clients (including the sender)
    io.emit('server message',socket.id + ":  "+msg);
  });

  // Handle disconnection event
  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected');
    socket.emit('server message', socket.id + ' disconnected');
  });
});







const MailDev = require("maildev");

// Start MailDev programmatically
const maildev = new MailDev({
  smtp: 1025, // SMTP server
  web: 1080, // Web UI
});

maildev.listen(() => {
  console.log("MailDev is running on http://localhost:1080");
});

// MailDev event listener (optional)
// maildev.on("new", (email) => {
//   console.log("New email received:", email.subject);
// });
app.use(cors())
app.use(express.json());
app.use(checkJson);

mongoose.connect("mongodb://localhost/social").then(() => {
  console.log("connected");
});

app.use("/api", userRouter);

let port = process.env.PORT;
console.log(port);

server.listen(port);
