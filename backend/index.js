const express= require("express");
const mongoose=require('mongoose')
const authRoute=require("./routes/app");
const app=express();
app.use(express.json());

app.use("/api/auth",authRoute);


mongoose.connect('mongodb://127.0.0.1:27017/userRegistration')
.then(()=>{console.log("MongoDB conneceted")})
.catch(err=>(console.log("mongo error",err)))


const PORT=3000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});



