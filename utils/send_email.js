"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");
const templateCreateAccount = require("./template_email");

async function main(user) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASS,
    },
  });

  let info = await transporter.sendMail({
    from: '"Fix Hogar" <fixhogar.mir@gmail.com>',
    to: templateCreateAccount(user).to,
    subject: templateCreateAccount(user).subject,
    text: "Bienvenido a Fix Hogar",
    html: templateCreateAccount(user).html,
  });
}

// main({ email: "laurafcanon@gmail.com", name: "Laura" });
module.exports = main;
