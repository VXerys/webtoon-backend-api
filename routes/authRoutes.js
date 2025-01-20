const express = require('express');
require('dotenv').config();
const { registerUser, verifyUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/register', registerUser);

router.post('/verify', verifyUser);

router.post('/login', loginUser);

// router.get('/profile', verifyToken, (req, res) => {
//   res.json({ message: `Welcome, User ID: ${req.user.id}` });
// });

// router.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
//   res.json({ message: 'Welcome Admin!' });
// });

module.exports = router;
