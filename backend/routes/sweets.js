const express = require("express");
const router=express.Router()
const {  getSweets,postSweets,searchSweets,updateSweets  }=require('../controllers/sweetsController.js');




 router.get("/",getSweets)

 router.post("/",postSweets)

 router.post("/search", searchSweets)

 router.put("/:id",updateSweets)




module.exports = router;
