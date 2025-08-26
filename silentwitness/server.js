const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded form data
app.use(express.urlencoded({ extended: true })); // For handling form submissions
app.use(express.json()); // For handling JSON data

// Route for displaying the form
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

// Route for handling form submissions
app.post('/report', (req, res) => {
  const { name, incident } = req.body;

  // Check if incident description is provided
  if (!incident) {
    return res.status(400).send('Incident description is required');
  }

  // Here, you can save the report to a database or process it further.
  res.send('Report submitted successfully!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;  // Export app for testing
