const rateLimit = require('express-rate-limit');

// Custom keyGenerator on email
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,       // 1 hour
  max: 5,                         // block after 5 failed attempts
  keyGenerator: (req) => req.body.email || req.ip,
  handler: (req, res) => res.status(429).json({
    message: 'Too many failed login attempts; please try again later'
  })
});

module.exports = loginLimiter;
// Note: This will be used in the login controller to limit login attempts.