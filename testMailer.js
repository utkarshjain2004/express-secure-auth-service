require('dotenv').config();
const transporter = require('./src/config/Mailer.js');

transporter.verify()
  .then(() => console.log('✅ Mailer is ready'))
  .catch(err => console.error('❌ Mailer error:', err));
