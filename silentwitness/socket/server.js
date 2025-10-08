// ============================================================
// SilentWitness Application - Server Configuration
// Purpose: Provides backend logic for anonymous incident reporting
// ============================================================

// Importing core dependencies
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

// Initialize Express app and define port
const app = express();
const port = 3000;

// ============================================================
// Middleware Configuration
// ============================================================

// Parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));
// Parses incoming JSON payloads
app.use(express.json());
// Serves all static files from the 'public' directory (HTML, CSS, JS)
app.use(express.static('public'));

// ============================================================
// MongoDB Setup & Schema Definition
// ============================================================

const mongoURI = "mongodb+srv://silentuser:Joelvarghese2002@cluster0.ryxcsde.mongodb.net/silentwitness?retryWrites=true&w=majority";

// Connecting to MongoDB Atlas Cluster
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Defining the Report schema structure
const reportSchema = new mongoose.Schema({
  name: String,
  incident: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Creating the model from schema
const Report = mongoose.model("Report", reportSchema);

// ============================================================
// Route Definitions
// ============================================================

// Serve the home form page for submitting new reports
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the dashboard page that displays submitted reports
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Handle form submission for new reports
app.post('/report', async (req, res) => {
  const { name, incident } = req.body || {};

  // Validate required field
  if (!incident) return res.status(400).json({ error: "Incident description is required" });

  try {
    // Save new report to MongoDB
    const report = new Report({ name: name || "Anonymous", incident });
    await report.save();

    // Emit live update to all connected clients using Socket.IO
    const io = req.app.get('io');
    io.emit('report_submitted', report);

    // Respond with success message
    res.json({ message: "Report submitted successfully!", report });
  } catch (err) {
    console.error("❌ Error saving report:", err);
    res.status(500).json({ error: "Failed to save report" });
  }
});

// Fetch and return the latest 20 submitted reports
app.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ timestamp: -1 }).limit(20);
    res.json(reports);
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// ============================================================
// Socket.IO Configuration
// ============================================================

// Initialize HTTP server and bind Socket.IO
const server = http.createServer(app);
const io = new Server(server);
app.set('io', io);

// Log connection events for active clients
io.on('connection', (socket) => {
  console.log('🔌 A client connected:', socket.id);
});

// ============================================================
// Start the Express Server
// ============================================================

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
