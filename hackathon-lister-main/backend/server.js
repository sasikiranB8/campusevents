// backend/server.js (Minor update for connectDB)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
// Import connectDB and sequelize instance from updated db.js
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

// Load env vars
dotenv.config();

// --- Connect to Database ---
// ConnectDB function now also handles authentication and optional sync
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);


// --- Serve Frontend Statically ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running... (MySQL connected)');
  });
   app.use('/img', express.static(path.join(__dirname, '../frontend/img')));
}


// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  // More specific error handling can be added here
  res.status(err.status || 500).send(err.message || 'Something broke!');
});


const PORT = process.env.PORT || 5000;

// Start server *after* DB connection attempt (connectDB handles errors/exit)
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Optional: Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(async () => {
      console.log('HTTP server closed')
      await sequelize.close(); // Close database connection
      console.log('MySQL connection closed');
  })
})