const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); // NEW

const app = express();
const port = 3000;

// Parse bodies + serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // serves /style.css, /dashboard.html, etc.

// Home (form)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/style.css">
      </head>
      <body>
        <form action="/report" method="POST">
          <h1>Silent Witness</h1>
          <label for="name">Name (Optional):</label>
          <input type="text" name="name" id="name">
          <label for="incident">Incident:</label>
          <textarea name="incident" id="incident" required></textarea>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
});

// Serve live dashboard (make sure public/dashboard.html exists)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Handle report and EMIT socket event
app.post('/report', (req, res) => {
  const { name, incident } = req.body || {};
  if (!incident) return res.status(400).send('Incident description is required');

  // Emit to all connected clients (dashboard listens for this)
  const io = req.app.get('io');
  io.emit('report_submitted', {
    name: name || '',
    incident,
    timestamp: Date.now(),
    source: 'web'
  });

  // TODO: persist to DB if needed
  res.send('Report submitted successfully!');
});

// --- Socket.IO setup ---
const server = http.createServer(app);
const io = new Server(server);
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 A client connected:', socket.id);
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app; // keep for tests
