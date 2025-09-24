const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const User = require("../models/userModel.js");

const app = express();

app.use(express.json());
app.use(cors());

// DB connection
async function dbConnect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/userRegistration');
        console.log("MongoDB Connected ");
    } catch(err){
        console.log("Mong Error", err);
    }
}
dbConnect();

// Routes
app.post("/api/auth/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            msg: "username or password not found"
        });
    }
    try {
        const user = await User.create({ email, password });
        return res.status(201).json({ msg: 'success' });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ msg: 'registration failed', error: err.message });
    }
});

module.exports = app;
