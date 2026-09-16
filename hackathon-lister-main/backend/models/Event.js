// backend/models/Event.js (Corrected & Final)
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
// const User = require('./User'); // Uncomment if using relationships

class Event extends Model {}

Event.init({
  // --- Core Fields ---
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'Please provide an event title' } }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: { msg: 'Please provide a description' } }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: { isDate: { msg: 'Please provide a valid event date' } }
  },
  time: { // Optional time string
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: { // For Offline events only
    type: DataTypes.STRING,
    allowNull: true, // *** Must be TRUE to allow NULL for Online events ***
  },
  category: {
    type: DataTypes.ENUM('Technical', 'Non-Technical'),
    allowNull: false, // Category is required
    validate: { isIn: { args: [['Technical', 'Non-Technical']], msg: 'Invalid category' } }
  },
  mode: {
    type: DataTypes.ENUM('Online', 'Offline'),
    allowNull: false, // Mode is required
    validate: { isIn: { args: [['Online', 'Offline']], msg: 'Invalid mode' } }
  },
  type: { // Keeping 'type' as required based on the error
    type: DataTypes.ENUM('College', 'Non-College'),
    allowNull: false, // *** Kept FALSE - Requires value from form ***
    validate: { isIn: { args: [['College', 'Non-College']], msg: 'Invalid type' } }
  },
  organizer: {
    type: DataTypes.STRING,
    allowNull: false, // Organizer is required
    validate: { notEmpty: { msg: 'Please provide organizer details' } }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '/img/placeholder.jpg',
    validate: { isUrl: { msg: 'Please provide a valid image URL if entering one', require_protocol: false } }
  },
  registrationLink: {
    type: DataTypes.STRING,
    allowNull: true, // Link is optional
    validate: { isUrl: { msg: 'Please provide a valid registration URL if entering one', require_protocol: false } }
  },
  details: { // Extra info
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  registrationFee: { // Correct top-level placement
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // Fee is optional
    defaultValue: 0.00,
    validate: {
        isDecimal: { msg: 'Fee must be a valid decimal number.' },
        min: { args: [0], msg: 'Fee cannot be negative.' }
    }
  },
  createdBy: { // Foreign key to User table
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  // Timestamps (createdAt, updatedAt) added by Sequelize automatically
}, {
  sequelize,
  modelName: 'Event',
  tableName: 'events',
  timestamps: true,
  indexes: [
    { name: 'event_filters_idx', fields: ['category', 'mode', 'type', 'date'] }, // Include 'type' if kept
  ]
});

module.exports = Event;