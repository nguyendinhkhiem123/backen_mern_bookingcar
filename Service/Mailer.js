const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyendinhkhiem12a4@gmail.com',
    pass: 'Khiemlanhat123'
  }
});

module.exports= transporter;