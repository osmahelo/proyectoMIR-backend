"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const templateCreateAccount = require("./template_email");

async function sendEmailSendGrid(data) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: data.to, // Change to your recipient
    from: "Fix Hogar <fixhogar.mir@gmail.com>", // Change to your verified sender
    subject: data.subject,
    template_id: data.template_id,
    dynamic_template_data: data.dynamic_template_data,
  };
  try {
    const response = await sgMail.send(msg);
    console.log("envio correo");
  } catch (err) {
    console.error(err);
  }
}

async function sendEmail(user) {
  //sgMail.setApiKey('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')
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
module.exports = { sendEmail, sendEmailSendGrid };
