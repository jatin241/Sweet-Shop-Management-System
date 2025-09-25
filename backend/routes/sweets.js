const express = require("express");
const router=express.Router()
const {  getSweets,postSweets,searchSweets,updateSweets,deleteSweets  }=require('../controllers/sweetsController.js');


const authCheck = require("../middleware/authCheck.js");
const adminCheck = require("../middleware/adminCheck.js");

 router.get("/",getSweets)

 router.post("/",postSweets)

 router.post("/search", searchSweets)

 router.put("/:id",updateSweets)

router.delete("/:id",authCheck,adminCheck,deleteSweets)


module.exports = router;
