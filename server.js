const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.routes");
const checkJson = require("./middleware/checkjson");
require("dotenv").config();
const app = express();

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

app.use(express.json());
app.use(checkJson);

mongoose.connect("mongodb://localhost/social").then(() => {
  console.log("connected");
});

app.use("/api", userRouter);

let port = process.env.PORT;
console.log(port);

app.listen(port);
