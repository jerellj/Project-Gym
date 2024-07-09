const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const protectedController = require('../controllers/protectedController');

router.get('/protected', auth, protectedController.getProtectedData);

module.exports = router;