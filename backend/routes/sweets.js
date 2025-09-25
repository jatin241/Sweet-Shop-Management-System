const express = require("express");
const router=express.Router()
const {  getSweets,postSweets,searchSweets,updateSweets,deleteSweets,purchaseSweets,restockSweets  }=require('../controllers/sweetsController.js');


const authCheck = require("../middleware/authCheck.js");
const adminCheck = require("../middleware/adminCheck.js");

 router.get("/",getSweets)

 router.post("/",postSweets)

 router.post("/search", searchSweets)

 router.put("/:id",updateSweets)

router.delete("/:id",authCheck,adminCheck,deleteSweets)

router.post("/:id/purchase",purchaseSweets)

router.post("/:id/restock",authCheck,adminCheck, restockSweets)

module.exports = router;
