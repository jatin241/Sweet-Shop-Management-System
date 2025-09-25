const mongoose = require("mongoose")

const sweetSchema = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId
    },
    name: {
        type : String,
        required: true,
        unique: true
    },
    category: {
        type : String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
    
})



const Sweet = mongoose.model("Sweets",sweetSchema)

module.exports=Sweet