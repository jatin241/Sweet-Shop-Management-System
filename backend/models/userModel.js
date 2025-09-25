const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    email : {
        type : String,
        required: true,
        unique:true
    },
    password : {
        type : String,
        required : true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.comparePassword = function(plainPassword) {
  return this.password === plainPassword;
};


const User = mongoose.model("User",userSchema)

module.exports=User