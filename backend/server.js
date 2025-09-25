const express= require("express");
const mongoose=require('mongoose')
const authRoute=require("./routes/app");
const sweetsRoute = require("./routes/sweets")
const app=express();
app.use(express.json());
app.use("/api/auth",authRoute);
app.use("/api/sweets", sweetsRoute);
module.exports=app;