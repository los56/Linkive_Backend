import express from "express";
import { login } from "./userControllers";

const userRouter = express.Router();

userRouter.post("/login", login);

export default userRouter;
