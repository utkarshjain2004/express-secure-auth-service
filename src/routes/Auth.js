const express = require('express');
const router = express.Router();
const { registerLimiter } = require('../middleware/RateLimiter');
const loginLimiter = require('../middleware/LoginLimiter');

const {
  register,
  verifyRegistration,
  login,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', registerLimiter , register);
router.get('/verify-registration', verifyRegistration);
router.post('/login', loginLimiter,login);                        // ← ensure this line is present
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: `Hello, ${req.user.email}! You accessed a protected route.`
  });
});

module.exports = router;
