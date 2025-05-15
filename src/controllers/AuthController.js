const crypto = require('crypto');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const User      = require('../models/User');
const transporter = require('../config/Mailer');

// …now your exports.register, exports.verifyRegistration, exports.login…
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const verificationLink = `${process.env.BASE_URL}/verify-registration?token=${token}`;

    await transporter.sendMail({
      from: `"Secure App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification',
      html: `<p>Click the link to complete registration:</p><a href="${verificationLink}">${verificationLink}</a>`,
    });
    console.log('🔗  Using BASE_URL =', process.env.BASE_URL);

    res.status(200).json({ message: 'Verification email sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
};

const verifyRegistration = async (req, res) => {
  const { token } = req.query;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findOne({ email: payload.email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({
      email: payload.email,
      password: payload.password,
      isVerified: true,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

//Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 2. Check if verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 4. Sign JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    user.resetToken = token;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
  to: user.email,
  subject: 'Reset your password',
  text: `Click this link to reset your password (expires in 15 min):\n\n${resetLink}`,
  html: `<p>Click <a href="${resetLink}">${resetLink}</a> to reset your password. The link will expire in 15 minutes.</p>`
});


    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};
module.exports = {
  register,
  login,
  verifyRegistration,
  forgotPassword, // 👈 add this
  resetPassword   // 👈 and this
};