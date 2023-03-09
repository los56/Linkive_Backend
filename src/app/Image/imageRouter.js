const express = require('express');
const router = express.Router();

const imageController = require('./imageController');

router.use('/upload', imageController.upload);
router.use('/delete', imageController.delete);

module.exports = router;