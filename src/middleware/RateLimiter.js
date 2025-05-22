const rateLimit = require('express-rate-limit');

// 1) Registration limiter: max 5 attempts per IP per hour
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    message: 'Too many registration attempts from this IP, please try again after an hour'
  }
});

// 2) Login limiter: max 5 failed attempts per user per hour
// We’ll attach this in the login controller—see note below.

module.exports = { registerLimiter };
// Note: For the login limiter, we’ll need to store the number of failed attempts in the database.