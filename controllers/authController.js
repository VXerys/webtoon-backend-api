const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db/connection');

const registerUser = async (req, res) => {
 const { username, password, email } = req.body;

 try {
  const existingUser = await db.query(
   'SELECT * FROM users WHERE username = ? OR email = ?',
   [username, email]
  );

  if (existingUser.length > 0) {
   return res.status(400).json({ message: 'Username or email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query( 
   'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
   [username, hashedPassword, email]
  ); 

  res.status(201).json({ message: 'User registered successfully' });
 } catch (error) {
  console.error('Error registering user:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

const loginUser = (req, res) => {
 const { username, password } = req.body;

 db.query(`SELECT * FROM users WHERE username = ?`, [username], async (err, results) => {
  if (err) {
   console.error('Error logging in user:', err);
   res.status(500).json({ message: 'Internal server error' });
  } else {
   if (results.length === 0) {
    res.status(401).json({ message: 'Invalid username or password' });
   } else {
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
     const token = jwt.sign({ userId: user.id }, 'your-secret-key');
     res.status(200).json({ token });
    } else {
     res.status(401).json({ message: 'Invalid username or password' }); 
    } 
   }
  }
 });
};

const forgotPassword = (req, res) => {
 const { email } = req.body;

 db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
  if (err) {
   console.error('Error resetting password:', err);
   res.status(500).json({ message: 'Internal server error' });
  } else {
   if (results.length === 0) {
    res.status(404).json({ message: 'User not found' });
   } else {
    const user = results[0];
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token });
   }
  }
 });
};

const resetPassword = (req, res) => {
 const { token, newPassword } = req.body;

 jwt.verify(token, 'your-secret-key', (err, decoded) => {
  if (err) {
   res.status(401).json({ message: 'Invalid token' });
  } else {
   db.query(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, decoded.userId], (err, results) => {
    if (err) {
     console.error('Error resetting password:', err);
     res.status(500).json({ message: 'Internal server error' });
    } else {
     res.status(200).json({ message: 'Password reset successfully' });
    }
   });
  }
 });
};

const logoutUser = (req, res) => {
 res.status(200).json({ message: 'User logged out successfully' });
};


module.exports = {
 registerUser,
 loginUser,
 resetPassword,
 forgotPassword,
 logoutUser
};