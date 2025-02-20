const nodemailer = require("nodemailer");
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

async function sendEmail(subject, html, userEmail) {
  //   console.log("this is the" + html);

  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: "test@test.com", // list of receivers
      subject: subject, // Subject line
      //   text: text, // plain text body
      html: html, // html body
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendEmail;
