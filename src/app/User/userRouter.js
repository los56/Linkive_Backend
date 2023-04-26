require("dotenv").config();

import express from "express";
import { sendVerifyEmail, sendEmailUserId } from "../../../utils/sendEmail";
import {
  login,
  signup,
  changePassword,
  changeUserInfo,
  deleteUser,
} from "./userControllers";
import { jwtAuthorization } from "../../../middlewares/jwtAuthorization";
import { oauth2Client, authorizationUrl } from "../../../config/oauth";
import { getUserById } from "./userProvider";
import { createUser } from "./userService";
import checkAuth from "../../../middlewares/checkAuth";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.post("/verifyEmail/send", sendVerifyEmail); // 이메일 인증번호 보내기
userRouter.post("/findId", sendEmailUserId); // 아이디 찾기
userRouter.post("/changePassword", changePassword); // 비밀번호 변경 to do : 이메일 입력 추가
userRouter.post("/changeUserInfo", jwtAuthorization, changeUserInfo); // 회원정보 변경, to do : 프로필사진변경
userRouter.get("/jwtAuthorization", jwtAuthorization, (req, res) => {
  // jwt 토큰 인증 테스트
  return res.status(200).json({
    message: "good",
    accessToken: res.locals.accessToken,
    refreshToken: res.locals.refreshToken,
  });
});
userRouter.get("/checkAuth", checkAuth, (req, res) => {
  // checkAuth 테스트
  return res.redirect(302, `${process.env.CLIENT_URL}/`); 
});
userRouter.delete("/deleteUser", jwtAuthorization, deleteUser); // 회원탈퇴

// 소셜로그인 : 구글
userRouter.get("/auth/google", (req, res) => {
  res.writeHead(301, { Location: authorizationUrl });
  res.end();
});
userRouter.get("/auth/google/callback", async (req, res, next) => {
  console.log("google callback");

  const url = require("url");
  // Receive the callback from Google's OAuth 2.0 server.
  if (req.url.startsWith("/auth/google/callback")) {
    let userCredential = null;
    // Handle the OAuth 2.0 server response
    let q = url.parse(req.url, true).query;
    if (q.error) {
      // An error response e.g. error=access_denied
      console.log("Error:" + q.error);
    } else {
      // Get access and refresh tokens (if access_type is offline)
      let { tokens } = await oauth2Client.getToken(q.code);
      oauth2Client.setCredentials(tokens);
      console.log(tokens);
      console.log(tokens.access_token);

      // Get the user's profile information
      let userInfo = await oauth2Client.request({
        url: "https://www.googleapis.com/oauth2/v2/userinfo",
      });
      const { id, email, name, picture } = userInfo.data;

      console.log(userInfo.data);
      console.log("google login success");
      userCredential = userInfo.data;

      // DB 확인 후 로그인 처리
      try {
        const exUser = await getUserById(id); // 이미 가입된 유저인지 확인
        if (exUser) {
          console.log("이미 가입된 유저");
          // 로그인 인증 완료 후 쿠키에 액세스 토큰 저장 및 클라이언트에게 전송
          res.cookie("accessToken", tokens.access_token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15일 후 만료
          });
          return res.redirect(`${process.env.CLIENT_URL}/`); // 로그인 인증 완료
        } else {
          const newUser = await createUser({
            id,
            password: id,
            email,
            nickname: name,
            socialLogin: "google",
          }); // 새로운 유저면 생성
          console.log("새로운 유저 생성");
          // 로그인 인증 완료 후 쿠키에 액세스 토큰 저장 및 클라이언트에게 전송
          res.cookie("accessToken", tokens.access_token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15일 후 만료
          });
          return res.redirect(`${process.env.CLIENT_URL}/`); // 로그인 인증 완료
        }
      } catch (err) {
        console.error(err);
        return next(err);
      }

      // res.redirect(`${process.env.CLIENT_URL}/login`);
      // res.redirect(`${process.env.CLIENT_URL}/login?email=${userCredential.email}&name=${userCredential.name}`);
    }
  }
});

// 소셜로그인 : 네이버

// 소셜로그인 : 카카오

export default userRouter;
