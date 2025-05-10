//const express = require("express")

import dotenv from "dotenv";
import express from "express";

import authRoute from "./routes/auth.route.js";

dotenv.config();
const app = express(); // server instance using this we can make the routes, middlewares etc...
const PORT = process.env.PORT;


app.use("/api/auth", authRoute);

app.listen(PORT, () => {
    console.log("Server is running on the port 5000")
})