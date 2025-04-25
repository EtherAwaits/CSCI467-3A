const nodemailer = require('nodemailer');
const dotenv = require("dotenv").config();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: '465',
  secure: true, // true for 465, false for other ports
  auth: {
    user: "autoparts467",
    pass: dotenv.parsed.EMAIL_PASSWORD, 
  },
});


const send = (to, content, subject) => {
  return new Promise((resolve, reject) => {
    if (!content) return reject(new Error('fail because mail content was empty'));
      const options =  {
        from: "autoparts467@zohomail.com",
        to,
        subject,
        text: '', // plain text body
        html: content, // html body
      };
      return transporter.sendMail(options, (error, info) => {
        if (error) return reject(error);
        return resolve(info);
      });
    });
};

send('ryangroch98@gmail.com', 'Hello, this is an email?', 'An email???');
