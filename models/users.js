const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const cardSchema = new mongoose.Schema({
  expMonth: {
    type: String,
    required: true,
    trim: true,
  },
  expYear: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mask: {
    type: String,
    required: true,
    trim: true,
  },
  tokenId: {
    type: String,
    required: true,
    trim: true,
  },
},
{_id: false}
);

const billingSchema = new mongoose.Schema({
  creditCards: [cardSchema],
  customerId: String,
},
{_id:false},
);

const userSchema = new mongoose.Schema(
  {
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
    passwordResetToken: String,
    passwordResetExpires: Date,
    billing:billingSchema,
  },

  { timestamps: true }
);

//Encriptación password
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})
userSchema.methods.createJWT = function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

userSchema.methods.comparePassword = async function (passwordCheck) {
  const isMatch = await bcrypt.compare(passwordCheck, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
