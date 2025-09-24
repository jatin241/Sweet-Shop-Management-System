const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config()

const app=express();

app.use(express.json())
app.use(cors())

async function dbConnect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/userRegistration')
        console.log("MongoDB Connected ")
    } catch(err){
        console.log("Mong Error",err)
    }
}
dbConnect();
app.listen(process.env.PORT,()=>{console.log(`server is running on port ${process.env.PORT}`)})
