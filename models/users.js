const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {type:String, required:[true, "Name is required"]},
  lastName: {type:String, required:[true, "Last Name is required"]},
  email: {type:String, required:[true, "Email is required"]},
  password: {type:String, required:[true, "Password is required"]},
  city: {type:String, required:[true, "City is required"]},
  address: {type:String, required:[true, "Address Name is required"]},
  phone: {type:Number, required:[true, "Phone is required"]},
  image: {type:String, required:false},
  createdAt: {type:Date, default: Date.now()},
})

module.exports = mongoose.model('User', userSchema)