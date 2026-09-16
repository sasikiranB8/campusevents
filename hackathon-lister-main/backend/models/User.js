// backend/models/User.js
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db'); // Import the sequelize instance

class User extends Model {
  // Method to compare entered password with hashed password
  async matchPassword(enteredPassword) {
    // Handle cases where password might be null/undefined (shouldn't happen with validation)
    if (!this.password || !enteredPassword) {
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Username already exists'
    },
    validate: {
      notEmpty: { msg: 'Username cannot be empty' },
      // Optional: Add more username validation if needed (e.g., min/max length, allowed chars)
      // is: /^[a-zA-Z0-9_]+$/i // Example: Alphanumeric and underscores only
    }
  },
  // --- ADDED Email Field ---
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
          args: true,
          msg: 'Email address already in use'
      },
      validate: {
          notEmpty: { msg: 'Email cannot be empty' },
          isEmail: { msg: 'Please enter a valid email address' }
      }
  },
  // --- End Added Email Field ---
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 255], // Min 6 characters
        msg: 'Password must be at least 6 characters long'
      },
      notEmpty: { msg: 'Password cannot be empty' } // Added notEmpty validation
    }
  },
  college: { // *** ADDED ***
    type: DataTypes.STRING,
    allowNull: true // Or false if required on signup
  },
  year: { // *** ADDED ***
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
        isInt: { msg: 'Year must be an integer.'},
        min: { args: [1], msg: 'Year must be positive.' } // Example validation
    }
  },
  // Timestamps (createdAt, updatedAt) are added automatically by Sequelize by default
}, {
  // Other model options go here
  sequelize, // Pass the connection instance
  modelName: 'User', // Choose the model name
  tableName: 'users', // Explicitly define table name
  timestamps: true, // Enable timestamps
  hooks: {
    // Hook to hash password before creating/saving a user
    beforeSave: async (user, options) => {
      // Only hash if password was changed or is new
      if (user.changed('password') || user.isNewRecord) {
          if (user.password) { // Ensure password exists before hashing
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          } else {
              // This should ideally be caught by validation, but added as safeguard
              throw new Error("Password cannot be null before hashing.");
          }
      }
    }
  },
  // Default scope to exclude password
  defaultScope: {
      attributes: { exclude: ['password'] },
  },
   scopes: {
      withPassword: {
         attributes: {}, // Include all attributes, including password
      },
      profile: {
        attributes: { exclude: ['password'] }
    }
   },
});


module.exports = User;