"use strict";
require('dotenv').config();
const nodemailer = require("nodemailer");

async function main() {
 
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
    from: '"Fix Hogar" <foo@example.com>',
    to: "laurafcanon@gmail.com, apuello1025@gmail.com",
    subject: "We made it?",
    text: "Hello world?",
    html: "<b>Yesssss, we made it!!!</b>",
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);
