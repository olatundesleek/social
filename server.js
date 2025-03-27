const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const checkJson = require("./middleware/checkjson");
const http = require('http');

// Load environment variables based on the current NODE_ENV (default: development)
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
require("dotenv").config({ path: envFile });

const app = express();
const cors = require('cors');
const { Server } = require('socket.io');

const server = http.createServer(app); // Create an HTTP server using Express

// Set up Socket.io for real-time communication
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend connections from any origin
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"], // Define allowed headers (optional)
    credentials: true // Enable credentials support for cookies or authentication
  }
});

const onlineUsers = new Map(); // Store connected users

// Handle a new socket connection
io.on('connection', (socket) => {
  console.log(socket.id + ' connected');
  onlineUsers.set(socket.id, 'guest');  // Add the user as a guest

  console.log(onlineUsers);

  // Convert the Map to an array and broadcast the list of online users
  const onlineUsersArray = Array.from(onlineUsers.entries());
  io.emit('onlineUsers', onlineUsersArray);

  io.emit('server message', socket.id + ' connected');

  // Event listener for private chat messages
  socket.on('pchat', (data) => {
    console.log('message received: ' + data);
    const message = data.message;
    io.to(data.to).emit('chat', { from: "test", message }); // Send message to specific user
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected');
    onlineUsers.delete(socket.id);  // Remove the user from the Map
    const onlineUsersArray = Array.from(onlineUsers.entries());
    io.emit('onlineUsers', onlineUsersArray); // Update online users list
  });
});

// MailDev setup for testing emails
const MailDev = require("maildev");

// Initialize MailDev with SMTP and Web UI ports
const maildev = new MailDev({
  smtp: 1025, // Local SMTP server
  web: 1080,  // Web UI to view emails
});

maildev.listen(() => {
  console.log("MailDev is running on http://localhost:1080");
});

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests
app.use(checkJson); // Custom middleware for JSON validation
app.use(cookieParser()); // Middleware to parse cookies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Set up API routes
app.use("/api", userRouter);
app.use("/api", postRouter);

let port = process.env.PORT || 3000; // Use the port from environment variables or default to 3000
console.log("Server is running on port", port);

server.listen(port); // Start the HTTP server
