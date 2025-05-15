const express = require('express');
const router = express.Router();

const {
  register,
  verifyRegistration,
  login,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.get('/verify-registration', verifyRegistration);
router.post('/login', login);                        // ← ensure this line is present
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: `Hello, ${req.user.email}! You accessed a protected route.`
  });
});

module.exports = router;
