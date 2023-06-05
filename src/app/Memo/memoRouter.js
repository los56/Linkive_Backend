const express = require('express');
const router = express.Router();

const memoController = require('./memoController');
const { jwtAuthorization } = require("../../../middlewares/jwtAuthorization");


router.post('/create', jwtAuthorization, memoController.createMemo);
router.post('/edit', jwtAuthorization, memoController.editMemo);
router.post('/delete', jwtAuthorization, memoController.deleteMemo);

router.post('/folders/:id', jwtAuthorization, memoController.getMemoInFolder);
router.post('/:id', jwtAuthorization, memoController.detailMemo);
router.post('/', jwtAuthorization, memoController.requestMemo);

module.exports = router;