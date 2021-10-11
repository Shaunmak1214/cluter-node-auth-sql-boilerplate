const express = require('express');
const router = express.Router();

const { sendWithTemplate } = require('../controllers/mail.controller');

router.get('/', sendWithTemplate);

module.exports = router;
