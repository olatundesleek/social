const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.routes");
const checkJson = require("./middleware/checkjson");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(checkJson);

mongoose.connect("mongodb://localhost/social").then(() => {
  console.log("connected");
});

app.use("/api", userRouter);

let port = process.env.PORT;
console.log(port);

app.listen(port);
