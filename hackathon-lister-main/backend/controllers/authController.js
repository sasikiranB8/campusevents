// backend/controllers/authController.js
const User = require('../models/User'); // Sequelize User model
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize'); // For specific error types
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  // ---- MODIFIED: Expect username, email, password from frontend ----
  const { username, email, password } = req.body; // Changed 'name' to 'username'

  // ---- MODIFIED: Validate username, email, password ----
  if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' }); // Changed validation message
  }
   if (password.length < 6) {
     return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }


  try {
    // ---- MODIFIED: Create user with username and email ----
    // Assumes User model now has 'username' field (and maybe 'name' is optional/removed)
    const user = await User.create({
      username, // Use the 'username' received from frontend
      email,    // Use the 'email' received from frontend
      password, // Password hashing happens via model hook
      // name: username // Optionally set name field to username if model still has name
    });

    // ---- MODIFIED: Return username and email in response ----
    res.status(201).json({
      _id: user.id,
      username: user.username, // Return the user's username
      // name: user.name,      // Only include if name is still relevant and set
      email: user.email,
      token: generateToken(user.id),
    });

  } catch (error) {
    console.error('Registration Error:', error);
    // Handle specific Sequelize errors
    if (error instanceof Sequelize.ValidationError) {
        // Check for specific validation errors (e.g., uniqueness)
        if (error.errors.some(e => (e.path === 'email' || e.path === 'username') && e.type === 'unique violation')) {
             // Check if the error is for email or username uniqueness
             const field = error.errors.find(e => e.path === 'email' || e.path === 'username').path;
            return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use` });
        }
       if (error.errors.some(e => e.path === 'email' && e.validatorKey === 'isEmail')) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }
      // General validation errors
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // Check if it's the unique constraint error (covers email and username)
    if (error instanceof Sequelize.UniqueConstraintError) {
       const field = error.fields && Object.keys(error.fields)[0] ? Object.keys(error.fields)[0] : 'Value'; // Try to get field name
       return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
    }
    // Generic server error
    res.status(500).json({ message: 'Server Error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  // ---- Login still uses email and password ----
  const { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email, including the password for comparison
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
       // ---- MODIFIED: Return username and email in response ----
      res.json({
        _id: user.id,
        username: user.username, // Include username in login response
        // name: user.name,      // Only include if name is still relevant
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Server Error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  // req.user is set by 'protect' middleware (using default scope - no password)
  if (req.user) {
      // Send back the user data including new fields if they exist on req.user
      // Sequelize model instance automatically includes all non-excluded fields
      res.status(200).json(req.user); // req.user already excludes password due to defaultScope
  } else {
      // This case is unlikely if 'protect' succeeded but good practice
      res.status(404).json({ message: 'User not found' });
  }
};
exports.updateMe = async (req, res) => {
  // User ID comes from the 'protect' middleware via req.user
  const userId = req.user.id;

  // Get data allowed to be updated from request body
  const { college, year /* Add other fields like name, password if needed */ } = req.body;

  console.log(`Updating profile for user ID: ${userId}`);
  console.log("Data received for update:", req.body);

  try {
      // Find the user by primary key
      const user = await User.findByPk(userId);

      if (!user) {
           // Should not happen if protect middleware worked correctly
          return res.status(404).json({ message: 'User not found.' });
      }

      // Update the fields - only update if value is provided in request body
      // Use || user.college syntax to keep existing value if new one isn't sent
      user.college = college !== undefined ? college : user.college;
      user.year = year !== undefined ? year : user.year;
      // Add password update logic here if needed (hash new password before saving)

      // Save the updated user instance
      const updatedUser = await user.save();

      // **Important:** Use a scope or manually exclude password before sending back
      // Option 1: Manually build response object
       const responseUser = {
           _id: updatedUser.id, // Use _id mapping if frontend expects it elsewhere
           id: updatedUser.id,
           username: updatedUser.username,
           email: updatedUser.email,
           college: updatedUser.college,
           year: updatedUser.year,
           createdAt: updatedUser.createdAt,
           updatedAt: updatedUser.updatedAt,
       };

      // Option 2: Refetch using scope (slightly less efficient but safer)
      // const responseUser = await User.scope('profile').findByPk(userId);


      console.log("Profile Updated Successfully for user:", responseUser.username);
      res.status(200).json(responseUser); // Send back updated user data (excluding password)

  } catch (error) {
      console.error("Error updating profile:", error);
       if (error instanceof Sequelize.ValidationError) {
           const messages = error.errors.map(e => `${e.path}: ${e.message}`);
           return res.status(400).json({ message: `Validation Error: ${messages.join('. ')}` });
       }
       // Generic server error
       res.status(500).json({ message: 'Server Error updating profile' });
  }
};