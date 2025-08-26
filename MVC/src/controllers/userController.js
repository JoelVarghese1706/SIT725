const User = require('../models/User');

exports.addUser = async (req, res) => {
  try {
    const { name = 'John Doe', age = 30 } = req.body || {};
    const user = new User({ name, age });
    await user.save();
    res.send('User added!');
  } catch (err) {
    res.status(500).send('Error adding user: ' + err);
  }
};