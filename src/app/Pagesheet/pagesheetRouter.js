

const express = require("express");
const router = express.Router();
const {jwtAuthorization} = require('../../../middlewares/jwtAuthorization');
const pagesheetController = require("./pagesheetController");

router.post("/create", jwtAuthorization, pagesheetController.createPagesheet);
router.post("/edit", jwtAuthorization, pagesheetController.editPagesheet);
router.post("/delete", jwtAuthorization, pagesheetController.deletePagesheet);

module.exports = router;