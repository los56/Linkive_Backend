import express from "express";
import {
  emailLogin,
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
} from "./userControllers";
import { getUserById } from "./userProvider";

const userRouter = express.Router();

userRouter.get("/:id", getUserById);
userRouter.post("/emailLogin", emailLogin);
userRouter.get("/accesstoken", accessToken);
userRouter.get("/refreshtoken", refreshToken);
userRouter.get("/login/success", loginSuccess);
userRouter.post("/logout", logout);

export default userRouter;
