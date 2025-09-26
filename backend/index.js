const express= require("express");
const mongoose=require('mongoose')

const cors = require('cors');
const authRoute=require("./routes/app");
const sweetsRoute = require("./routes/sweets")
const app=express();
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/sweets", sweetsRoute)


mongoose.connect('mongodb://127.0.0.1:27017/userRegistration')
.then(()=>{console.log("MongoDB conneceted")})
.catch(err=>(console.log("mongo error",err)))


const PORT=3000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});



