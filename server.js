const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const checkJson = require("./middleware/checkjson");
const http = require('http');
require("dotenv").config();

const app = express();
const cors = require('cors');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow your frontend to connect
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"], // Optional: If you're sending custom headers
    credentials: true // Optional: If you're using cookies or other credentials
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(socket.id + ' connected');
  onlineUsers.set(socket.id, 'guest');  // Add the user to the Map

  console.log(onlineUsers);

  // Convert Map to an array before emitting
  const onlineUsersArray = Array.from(onlineUsers.entries());  // Converts Map to [[socketId, 'guest'], ...]
  io.emit('onlineUsers', onlineUsersArray);  // Emit the array

  io.emit('server message', socket.id + ' connected');

  // this will be to auth and emit online users
  // socket.on('register', (username) => {
  //   onlineUsers.set(socket.id, username);
  //   const onlineUsersArray = Array.from(onlineUsers.entries());  // Convert Map to array again after update
  //   io.emit('onlineUsers', onlineUsersArray);  // Emit updated list
  // });

  socket.on('pchat', (data) => {
    console.log('message received: ' + data);
    const message = data.message
    io.to(data.to).emit('chat',{ from:"test",message});
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected');
    onlineUsers.delete(socket.id);  // Remove the user from the Map
    const onlineUsersArray = Array.from(onlineUsers.entries());  // Convert Map to array again after update
    io.emit('onlineUsers', onlineUsersArray);  // Emit updated list
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

app.use(cors());
app.use(express.json());
app.use(checkJson);
app.use(cookieParser()); // Middleware to parse cookies

mongoose.connect("mongodb://localhost/social")
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/api", userRouter);

let port = process.env.PORT || 3000;
console.log("Server is running on port", port);

server.listen(port);
