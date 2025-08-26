// server.js (root)
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./src/routes/userRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

/* --------------------------- middleware --------------------------- */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// tiny request logger (helps when you click Submit)
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/* ----------------------------- routes ----------------------------- */
app.use('/users', userRoutes);      // POST /users
app.use('/contact', contactRoutes); // POST /contact

app.get('/health', (_req, res) => res.json({ ok: true }));

// 404 for unknown API routes (kept after your routes)
app.use('/api', (_req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

// generic error handler so fetch gets JSON, not HTML
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ ok: false, error: err.message || 'Server error' });
});

/* ------------------------ DB connect & start ---------------------- */
(async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('❌ Missing MONGO_URI in .env');
      process.exit(1);
    }

    // optional but helpful
    mongoose.connection.once('open', () => console.log('✅ Mongo connected'));
    mongoose.connection.on('error', (e) => console.error('Mongo error:', e));

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    // graceful shutdown
    const shutdown = async (sig) => {
      console.log(`\n${sig} received, closing server...`);
      await mongoose.connection.close();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();