import express from "express";
import {
  login,
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
} from "./userControllers";
import { getUserById } from "./userProvider";

const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.post("/logout", logout);

export default userRouter;
