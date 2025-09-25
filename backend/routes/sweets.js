const express = require("express");
const router=express.Router()
const {  getSweets,postSweets,searchSweets  }=require('../controllers/sweetsController.js');




 router.get("/",getSweets)

 router.post("/",postSweets)

 router.post("/search", searchSweets)




module.exports = router;
