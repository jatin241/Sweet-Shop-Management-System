const express = require("express");
const router=express.Router()
const {  getSweets,postSweets  }=require('../controllers/sweetsController.js');
const authCheck = require("../middleware/authCheck.js");
const adminCheck = require("../middleware/adminCheck.js");



 router.get("/",getSweets)

 router.post("/",postSweets)




module.exports = router;
