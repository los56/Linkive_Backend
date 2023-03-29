const express = require('express');
const router = express.Router();

const imageController = require('./imageController');
const jwt = require('../../../middlewares/jwtMiddlewares');
const auth = jwt.authMiddleware;

const upload = require('./setMulter');

router.post('/upload', auth, upload.single('img'), imageController.upload);
router.post('/delete', imageController.delete);

module.exports = router;