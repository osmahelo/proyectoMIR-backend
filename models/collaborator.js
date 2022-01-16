const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema({
  name: {type:String, required:[true, "Name is required"], minlength:4},
  lastName: {type:String, required:[true, "Last Name is required"], minlength:4},
  email: {type:String, required:[true, "Email is required"], match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"], unique:true},
  password: {type:String, required:[true, "Password is required"], },
  city: {type:String, required:[true, "City is required"]},
  address: {type:String, required:[true, "Address Name is required"]},
  phone: {type:Number, required:[true, "Phone is required"], minlength:10, maxlength:10},
  image: {type:String, required:false},
  createdAt: {type:Date, default: Date.now()},
})

module.exports = mongoose.model('Collaborator', collaboratorSchema)