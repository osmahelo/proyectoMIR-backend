const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], minlength: 4 },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    minlength: 4,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: { type: String, required: [true, "Password is required"] },
  city: { type: String },
  address: { type: String },
  phone: { type: Number, minlength: 10, maxlength: 10 },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now() },
  active: { type: Boolean, default: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//Encriptación password
userSchema.pre("save", async function () {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (passwordCheck) {
  const isMatch = await bcryptjs.compare(passwordCheck, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
