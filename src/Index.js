require('dotenv').config();
const express = require('express');
const connectDB = require('./config/Db');
const transporter = require('./config/Mailer');
const authRoutes = require('./routes/Auth');

const app = express();
app.use(express.json());

// Startup logs
connectDB();
transporter.verify()
  .then(() => console.log('✅ Mailer is ready'))
  .catch(err => {
    console.error('❌ Mailer setup failed:', err);
    process.exit(1);
  });

app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
