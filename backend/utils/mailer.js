/*const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

exports.sendEmail = async (to, subject, text) => {
  const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };
  await transporter.sendMail(mailOptions);
};
*/

// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// General email function
exports.sendEmail = async (to, subject, text) => {
  const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };
  await transporter.sendMail(mailOptions);
};

// Specific function for adoption status updates
exports.sendAdoptionStatusEmail = async (email, status, catName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Adoption Status Update for ${catName}`,
    html: `<p>Your adoption application status has been updated to: <strong>${status}</strong></p>`
  };
  await transporter.sendMail(mailOptions);
};

// Add other specific email functions as needed
exports.sendDonationReceipt = async (email, amount, purpose) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Donation Receipt - Thank You!`,
    html: `<p>Thank you for your donation of $${amount} for ${purpose}.</p>`
  };
  await transporter.sendMail(mailOptions);
};