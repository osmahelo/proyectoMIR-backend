const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const requestService = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    addressUser: { type: String, required: true },
    date: { type: Date, required: true },
    phoneUser: { type: String, required: true },
    payment:{type:Boolean, default:false}
  },
  { _id: false }
);

const collaboratorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], minlength: 4 },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
      minlength: 4,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
    city: { type: String, required: [true, 'City is required'] },
    address: { type: String, required: [false, 'Address Name is required'] },
    phone: {
      type: Number,
      required: [false, 'Phone is required'],
      minlength: 10,
      maxlength: 10,
    },
    image: {
      type: String,
      required: false,
      default:
        'http://res.cloudinary.com/lauracanon/image/upload/v1644268959/yqjrfjunz7xv6qa0ng5z.png',
    },
    yearsExperiencie: { type: String, required: false },
    certificates: { type: String, required: false },
    createdAt: { type: Date, default: Date.now() },
    active: { type: Boolean, default: false },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services',
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    request: [requestService],
  },

  { timestamps: true }
);

collaboratorSchema.pre('save', async function () {
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});
collaboratorSchema.methods.createJWT = function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

collaboratorSchema.methods.comparePassword = async function (passwordcheck) {
  const isMatch = await bycrypt.compare(passwordcheck, this.password);
  return isMatch;
};

module.exports = mongoose.model('Collaborator', collaboratorSchema);
