const express = require('express');
const router = express.Router();

const userRouter = require("./User/userRouter").default;
const imageRouter = require("./Image/imageRouter");
const memoRouter = require("./Memo/memoRouter");
const folderRouter = require("./Folder/folderRouter");
const pagesheetRouter = require("./Pagesheet/pagesheetRouter");
const searchRouter = require("./Search/searchRouter");


const {swaggerUi, specs} = require("../../config/swagger");
router.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

router.use("/users", userRouter);
router.use("/images", imageRouter);
router.use("/memos", memoRouter);
router.use("/folders", folderRouter);
router.use("/pagesheets", pagesheetRouter);
router.use("/Search", searchRouter);

module.exports = router;