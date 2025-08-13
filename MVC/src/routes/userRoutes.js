const express = require('express');
const router = express.Router();
const { addUser } = require('../controllers/userController');

// POST /users
router.post('/', addUser);

module.exports = router;