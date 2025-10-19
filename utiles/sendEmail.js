const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1-create transport (transport is services that will send email like(gmail,mailgun,mailtrap))
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_host,
    port: process.env.EMAIL_port, //if secure is true port=465,if secure false port=587
    secure: true,
    auth: {
      user: process.env.EMAIL_user,
      pass: process.env.EMAIL_password,
    },
  });
  //2-define Email options (like to from subject )
  const emailoption = {
    from: "E-shop APP <moustafafattouh2@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3-send email
  await transporter.sendMail(emailoption);
};

module.exports = sendEmail;
