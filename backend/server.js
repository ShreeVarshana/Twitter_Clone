//const express = require("express")

import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";


import authRoute from "./routes/auth.route.js";
import connectDB from "./db/connectDB.js";

dotenv.config();
const app = express(); // server instance using this we can make the routes, middlewares etc...
app.use(cookieParser());
const PORT = process.env.PORT;

app.use(express.json())
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
    console.log("Server is running on the port 5000")
    connectDB();
})