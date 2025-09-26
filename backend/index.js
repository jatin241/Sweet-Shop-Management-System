const express= require("express");
const mongoose=require('mongoose')
require('dotenv').config()

const cors = require('cors');
const authRoute=require("./routes/app");
const sweetsRoute = require("./routes/sweets")
const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/sweets", sweetsRoute)


mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("MongoDB conneceted")})
.catch(err=>(console.log("mongo error",err)))


app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});



