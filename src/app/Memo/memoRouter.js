const express = require('express');
const router = express.Router();

const memoController = require('./memoController');

router.use('/create', memoController.createMemo);
router.use('/edit', memoController.editMemo);
router.use('/delete', memoController.deleteMemo);

module.exports = router;