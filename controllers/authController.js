const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const { sendVerificationEmail, generateVerificationCode, sendResetPasswordEmail, generateResetToken } = require('../services/emailService');

const registerUser = async (req, res) => {
 try {
  const { username, email, password, confirmPassword } = req.body;

  console.log('Received data:', { username, email, password, confirmPassword });

  if (password !== confirmPassword) {
   return res.status(400).json({ error: 'Password and confirm password do not match.' });
  }

  const [exitingUser] = await db.query(
   'SELECT * FROM users WHERE email = ?',
   [email]
  );

  if(exitingUser.length > 0) {
   if (!existingUser[0].is_verified) {
    const verificationCode = generateVerificationCode();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
     'UPDATE users SET username = ?, password = ?, verification_code = ? WHERE email = ? AND is_verified = false',
     [username, hashedPassword, verificationCode, email]
   );

   await sendVerificationEmail(email, verificationCode);
   return res.json({ message: 'Verification email resent. Please check your email.'});
  } else {
   return res.status(400).json({ error: 'Email is already registered and verified.' });
  }
 }

 const verificationCode = generateVerificationCode();
 const hashedPassword = await bcrypt.hash(password, 10);

 await db.query(
  'INSERT INTO users (username, email, password, verification_code) VALUES (?, ?, ?, ?)',
  [username, email, hashedPassword, verificationCode]
 );

 await sendVerificationEmail(email, verificationCode);
 res.json({ message: 'User registered successfully. Check your email for verification.'});
 } catch (error) {
 console.error('Error registering user:', error);
 res.status(500).json({error: 'Internal Server Error' });
 };
}

const verifyUser = async (req, res) => {
  try {
    const { email, verificationCode} = req.body;

    const [user] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (user.length === 0) {
      return res.status(401).json({ error: 'User not found'});
    }

    if(user[0].verification_code !== verificationCode) {
      return res.status(401).json({ error: 'Invalid verification code'});
    }

    await db.query(
      'UPDATE users SET is_verified = true, verification_code = NULL WHERE id = ?',
      [user[0].id]
    );

    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userData = user[0];

    // if (!userData.is_active) {
    //   return res.status(403).json({ error: 'Your account is inactive. Please contact support.' });
    // }

    if (!userData.is_verified) {
      return res.status(401).json({ error: 'Your account is not verified. Please verify your email.' });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: userData.id, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful.',
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword, resetToken } = req.body;
    
    if (!email || !newPassword || !confirmPassword || !resetToken) {
      return res.status(400).json({ error: 'Email, new password, confirm password, and reset token are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match.' });
    }

    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userData = user[0];

    if(!userData.reset_token || userData.reset_token !== resetToken)  {
      return res.status(400).json({ error: 'Invalid reset token.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      'UPDATE users SET password = ?, reset_token = NULL WHERE id = ?',
      [hashedPassword, userData.id]
    );

    res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userData = user[0];

    if (!userData.is_verified) {
      return res.status(401).json({ error: 'Your account is not verified. Please verify your email.' });
    }

    const resetToken = generateResetToken();

    await db.query(
      'UPDATE users SET reset_token = ? WHERE id = ?',
      [resetToken, userData.id]
    );

    await sendResetPasswordEmail(email, resetToken);

    res.json({ message: 'Password reset request sent. Please check your email.' });
  } catch (err) {
    console.error('Error requesting password reset:', err);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  resetPassword,
  requestResetPassword
};