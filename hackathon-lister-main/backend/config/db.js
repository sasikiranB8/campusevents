// backend/config/db.js (Updated for Sequelize)
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql', // Default to mysql
    port: process.env.DB_PORT || 3306,         // Default port
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log queries in dev
    pool: { // Optional connection pooling configuration
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Function to test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database Connection has been established successfully.');

    // IMPORTANT: Sync models (consider migrations for production)
    // { force: false } doesn't drop tables if they exist
    // { alter: true } tries to alter tables to match model (use carefully)
    if (process.env.NODE_ENV !== 'production') {
        // await sequelize.sync({ force: true }); // Resets DB - Use for initial dev only
        await sequelize.sync({ alter: true }); // Safer sync for dev changes
        console.log("Models synchronized successfully.");
    }

  } catch (error) {
    console.error('Unable to connect to the MySQL database:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { sequelize, connectDB }; // Export instance and connection function