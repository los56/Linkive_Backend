const express = require('express');
const {jwtAuthorization} = require("../../../middlewares/jwtAuthorization");
const {search} = require("./searchController");
const router = express.Router();

router.post('/', jwtAuthorization, search);

module.exports = router;