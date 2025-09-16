const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // serves index.html, style.css, dashboard.html, etc.

// --- MongoDB Setup ---
const mongoURI = "mongodb+srv://silentuser:Joelvarghese2002@cluster0.ryxcsde.mongodb.net/silentwitness?retryWrites=true&w=majority";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema + Model
const reportSchema = new mongoose.Schema({
  name: String,
  incident: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
const Report = mongoose.model("Report", reportSchema);

// --- Routes ---

// Serve home (form)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Handle report submission
app.post('/report', async (req, res) => {
  const { name, incident } = req.body || {};
  if (!incident) return res.status(400).json({ error: "Incident description is required" });

  try {
    const report = new Report({ name: name || "Anonymous", incident });
    await report.save();

    // Emit live update
    const io = req.app.get('io');
    io.emit('report_submitted', report);

    res.json({ message: "Report submitted successfully!", report });
  } catch (err) {
    console.error("❌ Error saving report:", err);
    res.status(500).json({ error: "Failed to save report" });
  }
});

// Fetch last 20 reports
app.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ timestamp: -1 }).limit(20);
    res.json(reports);
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// --- Socket.IO ---
const server = http.createServer(app);
const io = new Server(server);
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 A client connected:', socket.id);
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
