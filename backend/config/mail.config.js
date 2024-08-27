const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} = require("../utils/email.templates");

const sendVerificationEmail = async (to, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: "Verify your email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error enviando el email: ", error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const sendWelcomeEmail = async (to, username) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: "Welcome to SpendSmart",
    html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", username),
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error enviando el email: ", error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
  App;
};

module.exports = { sendVerificationEmail, sendWelcomeEmail };
