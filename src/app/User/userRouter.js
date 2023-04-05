require("dotenv").config();

import express from "express";
import { sendVerifyEmail, sendEmailUserId } from "../../../utils/sendEmail";
import {
  login,
  signup,
  changePassword,
  changeUserInfo,
  deleteUser,
  googleStrategy,
} from "./userControllers";
import { jwtAuthorization } from "../../../middlewares/jwtAuthorization";
import passport from "passport";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.post("/verifyEmail/send", sendVerifyEmail); // 이메일 인증번호 보내기
userRouter.post("/findId", sendEmailUserId); // 아이디 찾기
userRouter.post("/changePassword", changePassword); // 비밀번호 변경
userRouter.post("/changeUserInfo", jwtAuthorization, changeUserInfo); // 회원정보 변경, to do : 프로필사진변경
userRouter.get("/jwtAuthorization", jwtAuthorization, (req, res) => {
  return res.status(200).json({
    message: "good",
    accessToken: res.locals.accessToken,
    refreshToken: res.locals.refreshToken,
  });
});
userRouter.delete("/deleteUser", jwtAuthorization, deleteUser); // 회원탈퇴

// 소셜로그인 : 카카오, 네이버, 구글
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("google login success");
    res.redirect("/");
  }
);

// 회원탈퇴 : 이메일, 비밀번호 입력
// 비밀번호 찾기 : 아이디, 이메일입력 -> 인증번호 보냄 -> 변경할 비밀번호 입력

export default userRouter;
