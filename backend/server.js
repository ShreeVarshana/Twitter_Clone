//const express = require("express")

import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";



import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import connectDB from "./db/connectDB.js";
import postRoute from "./routes/post.route.js";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

});

const app = express(); // server instance using this we can make the routes, middlewares etc...
app.use(cookieParser());
const PORT = process.env.PORT;

app.use(express.json())
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.use("/api/posts", postRoute);


app.listen(PORT, () => {
    console.log("Server is running on the port 5000")
    connectDB();
})