const express = require('express');
require('dotenv').config();
const { registerUser, verifyUser, loginUser, resetPassword, requestResetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/jwtMiddlewares');

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword)
router.post('/request-reset-password', requestResetPassword);

// router.get('/profile', verifyToken, (req, res) => {
//   res.json({ message: `Welcome, User ID: ${req.user.id}` });
// });

// router.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
//   res.json({ message: 'Welcome Admin!' });
// });

module.exports = router;
