require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const authRoutes = require("./middleware/auth");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));


mongoose.connect('mongodb+srv://AzraPrugalidad:HCILAB1234@cluster0.bcgnwkz.mongodb.net/users?appName=Cluster0')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


app.use("/", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));