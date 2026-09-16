// backend/middleware/authMiddleware.js (Updated for Sequelize)
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import Sequelize User model
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token using Sequelize's findByPk (find by primary key)
      // Use the default scope which excludes the password
      req.user = await User.findByPk(decoded.id);
      // If you needed password for some reason here:
      // req.user = await User.scope('withPassword').findByPk(decoded.id);

      if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Optional: Convert Sequelize model instance to plain object if causing issues downstream
      // req.user = req.user.get({ plain: true });

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Not authorized, invalid token' });
      }
       if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };