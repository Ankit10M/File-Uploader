const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        minlength:[3, "user name must be in 3 characters"],
        unique:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        minlength:[10, "email must be 10 characters long"]
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:[8,"password must be 8 characters long"]
    }
})

const user = mongoose.model('user',userSchema)
module.exports = user;