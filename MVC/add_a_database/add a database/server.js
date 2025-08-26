const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://joelvarghese17:joelvarghese1706@cluster0.xk4n2b1.mongodb.net/mydb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Error connecting to MongoDB Atlas:', err));

// Define a schema for users (for your previous example)
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
// Create a model based on the user schema
const User = mongoose.model('User', userSchema);

// Route to add a new user
app.post('/addUser', (req, res) => {
  const newUser = new User({
    name: 'John Doe',
    age: 30,
  });

  newUser.save()
    .then(() => res.send('User added!'))
    .catch((err) => res.status(500).send('Error adding user: ' + err));
});

// Define a schema for contact form submissions
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Create a model based on the contact schema
const Contact = mongoose.model('Contact', contactSchema);

// Route to handle the contact form submission
app.post('/submitContact', (req, res) => {
  console.log("Form data received:", req.body);  // This will log the form data in the console

  const newContact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });

  newContact.save()
    .then(() => res.send('Message sent successfully!'))
    .catch((err) => res.status(500).send('Error saving message: ' + err));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});