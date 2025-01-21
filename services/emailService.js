const nodemailer = require('nodemailer')
const crypto = require('crypto');
require('dotenv').config();

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const generateResetToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
  socketTimeout: 20000,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`${subject} email sen successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending ${subject} email:`, error);
    throw new Error(`Failed to send ${subject} email`);
  }
}

const sendVerificationEmail = async (to, verificationCode) => {
  const html = `
    <p>Thank you for registering!</p>
    <p>Your verification code is: <strong>${verificationCode}</strong></p>
    <p>Please use this code to verify your email. The code will expire in 1 hour.</p>
  `;
  await sendEmail({to, subject: 'Email Verification', html});
};

const sendResetPasswordEmail = async (to, resetToken) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: 'Reset Password',
      html: `<p>Kode reset password Andadalah: <strong>${resetToken}</strong></p>
             <p>Kode ini akan kadaluarsa dalam 1 jam.</p>`,
    });
    console.log('Reset password email sent successfully');
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw new Error('Failed to send reset password email');
  }
};



module.exports = {
  sendResetPasswordEmail, 
  sendVerificationEmail,
  sendEmail,
  generateVerificationCode,
  generateResetToken
};
