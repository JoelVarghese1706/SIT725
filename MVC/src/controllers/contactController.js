const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    console.log('📩 /contact payload:', req.body); // <-- see what the browser sent
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    await Contact.create({ name, email, message });
    return res.json({ ok: true });
  } catch (err) {
    console.error('❌ Contact save failed:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};