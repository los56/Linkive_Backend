import express from "express";
import {
  emailLogin,
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
} from "./userControllers";

const userRouter = express.Router();

userRouter.post("/emailLogin", emailLogin);
userRouter.get("/accesstoken", accessToken);
userRouter.get("/refreshtoken", refreshToken);
userRouter.get("/login/success", loginSuccess);
userRouter.post("/logout", logout);

export default userRouter;
