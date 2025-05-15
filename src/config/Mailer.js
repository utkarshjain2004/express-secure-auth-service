const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password, not your Gmail password
  },
});
transporter.verify()
  .then(() => console.log('✅ Mailer is ready'))
  .catch(err => {
    console.error('❌ Mailer setup failed:', err);
    process.exit(1);
  });

module.exports = transporter;
