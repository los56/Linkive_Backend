const express = require('express');
const router = express.Router();

const { jwtAuthorization } = require("../../../middlewares/jwtAuthorization");
const folderController = require("./folderController");

router.post("/create", jwtAuthorization, folderController.createFolder);
router.post("/edit", jwtAuthorization, folderController.editFolder);
router.post("/delete", jwtAuthorization, folderController.deleteFolder);
router.post("/", jwtAuthorization, folderController.requestFolderList);

module.exports = router;