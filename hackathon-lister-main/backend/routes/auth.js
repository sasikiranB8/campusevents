// backend/routes/auth.js  <-- CORRECT CODE
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateMe  } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private route (requires token)
router.get('/me', protect, getMe); // Apply protect middleware here
router.put('/me', protect, updateMe);

module.exports = router;