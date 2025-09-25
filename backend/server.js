const express= require("express");
const mongoose=require('mongoose')
const authRoute=require("./routes/app");
const app=express();
app.use(express.json());
app.use("/api/auth",authRoute);
module.exports=app;