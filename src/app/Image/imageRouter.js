const express = require('express');
const router = express.Router();

const imageController = require('./imageController');

const upload = require('./setMulter');

router.post('/upload', upload.single('img'), imageController.upload);
router.post('/delete', imageController.delete);

module.exports = router;