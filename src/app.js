const express = require("express");
const app = express();
require("./utils/db"); //this is to connect to the DB
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  credentials: true, //to enable cookies to be accepted by backend
  allowedHeaders: "content-type",
  origin: "http://localhost:3000", //process.env.FRONTEND_URL
};

app.use(cors(corsOptions));
app.use(express.json()); // need for body parser later
app.use(cookieParser()); // for parsing of cookies
//app.use(cookieParser("someSecretKey")); // for parsing of cookies

const topicsRouter = require("./routes/topics.route");
//const userRouter = require("./routes/users.route");

app.use("/topics", topicsRouter);
//app.use("/user", userRouter);

app.get("/", (req, res) => {
  //main page
  res.status(200).json({
    "0": "GET /",
    "1": "GET /topics",
    "2": "POST /topics",
    "3": "GET /topics/:id",
    "4": "POST /topics/:id/comments",
    //notdone
    // "5": "GET /user",
    // "6": "POST /user/register",
    // "7": "POST /user/login",
    // "8": "POST /user/logout",
  });
});

app.use((err, req, res, next) => {
  //res.status(err.statusCode || 500);
  //console.log(err.message);
  res.status(err.statusCode).json({ error: err.message });
});

module.exports = app;
