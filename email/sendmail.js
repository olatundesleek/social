const nodemailer = require("nodemailer");
const generatePasswordResetEmail = require("../emailtemplate/paswordresetemail");
const generateUserRegisterationEmail = require("../emailtemplate/userregisterationemail");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false, // true for port 465, false for other ports
  //   auth: {
  //     user: "maddison53@ethereal.email",
  //     pass: "jn7jnAPss4f63QBp6D",
  //   },
});

async function sendPasswordResetEmail(token, user, email) {
  try {
    const subject = "Password-Reset";
    // const html = generatePasswordResetEmail(user, token);
    const html = generatePasswordResetEmail(user, token);
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      //   text: text, // plain text body
      html: html, // html body
    });
  } catch (error) {
    console.log(error);
  }
}

async function sendUserRegisterationEmail(username, email) {
  try {
    const subject = "Welcome to My Social";
    // const html = generatePasswordResetEmail(user, token);
    // const html = generatePasswordResetEmail(user, token);
    const html = generateUserRegisterationEmail(username);
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      //   text: text, // plain text body
      html: html, // html body
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { sendPasswordResetEmail, sendUserRegisterationEmail };
