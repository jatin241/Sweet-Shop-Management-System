const User = require('../models/userModel')
const jwt=   require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

async function register(req,res){
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).json({msg:"email and password missing"})
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg:"user already exists"});
        }
        const user=new User({email,password});
        await user.save();

        res.status(201).json({msg:"user created"})

    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"server error"});
    }
}
module.exports=register;