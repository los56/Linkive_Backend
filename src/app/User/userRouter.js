require("dotenv").config();

import express from "express";
import { sendVerifyEmail, sendEmailUserId } from "../../../utils/sendEmail";
import { setCookie } from "../../../utils/cookie";
import {
  login,
  signup,
  changePassword,
  changeUserInfo,
  deleteUser,
  socialLogin,
  getUserInfoByToken
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
userRouter.get("/userInfo", getUserInfoByToken); // 회원정보 조회


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

      // 로그인 처리
      try {
        await socialLogin(id, email, name, "google");
        setCookie(res, "accessToken", tokens.access_token); // 쿠키에 액세스 토큰 저장
        return res.redirect(`${process.env.CLIENT_URL}/`); // 로그인 인증 완료
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "로그인 처리 error",
        });
      }
    }
  }
});

// 소셜로그인 : 네이버
userRouter.get("/auth/naver", (req, res) => {
  const api_url =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    process.env.NAVER_CLIENT_ID +
    "&redirect_uri=" +
    process.env.NAVER_REDIRECT_URL +
    "&state=" +
    Math.random().toString(36).substr(3, 14);
  res.writeHead(301, { Location: api_url });
  res.end();
  // res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  // res.end(
  //   "<a href='" +
  //     api_url +
  //     "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>"
  // );
});
userRouter.get("/auth/naver/callback", async (req, res, next) => {
  const code = req.query.code;
  const state = req.query.state;
  let api_url =
    "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=" +
    process.env.NAVER_CLIENT_ID +
    "&client_secret=" +
    process.env.NAVER_CLIENT_SECRET +
    "&redirect_uri=" +
    process.env.NAVER_REDIRECT_URL +
    "&code=" +
    code +
    "&state=" +
    state;
  var request = require("request");
  let options = {
    url: api_url,
    headers: {
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
    },
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const accessToken = JSON.parse(body).access_token;
      res.redirect("/users/naver/member?access_token=" + accessToken);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});
// naver 유저 정보 받아오기
userRouter.get("/naver/member", async (req, res) => {
  const accessToken = req.query.access_token;
  var api_url = "https://openapi.naver.com/v1/nid/me";
  var header = "Bearer " + accessToken; // Bearer 다음에 공백 추가
  var options = {
    url: api_url,
    headers: { Authorization: header },
  };
  var request = require("request");
  request.get(options, async function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const { id, email, nickname, profile_image } = JSON.parse(body).response;
      console.log(
        `user info - id : ${id}, email : ${email}, nickname : ${nickname}, profile_img : ${profile_image}`
      );
      // DB 확인 후 로그인 처리
      try {
        await socialLogin(id, email, nickname, "naver");
        setCookie(res, "accessToken", accessToken); // 쿠키에 액세스 토큰 저장
        return res.redirect(`${process.env.CLIENT_URL}/`); // 로그인 인증 완료
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "로그인 처리 error",
        });
      }
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});

// 소셜로그인 : 카카오
userRouter.get("/auth/kakao", (req, res) => {
  const api_url =
    "https://kauth.kakao.com/oauth/authorize?client_id=" +
    process.env.KAKAO_CLIENT_ID +
    "&redirect_uri=" +
    process.env.KAKAO_REDIRECT_URL +
    "&response_type=code";
  res.writeHead(301, { Location: api_url });
  res.end();
});
userRouter.get("/auth/kakao/callback", async (req, res, next) => {
  const code = req.query.code;
  console.log("콜백하러왔씁니다");
  let api_url =
    "https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=" +
    process.env.KAKAO_CLIENT_ID +
    "&redirect_uri=" +
    process.env.KAKAO_REDIRECT_URL +
    "&code=" +
    code +
    "&client_secret=" +
    process.env.KAKAO_CLIENT_SECRET;
  var request = require("request");
  let options = {
    url: api_url,
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  };
  request.post(options, function (error, response, body) {
    console.log("토큰받아오기");
    if (!error && response.statusCode == 200) {
      const accessToken = JSON.parse(body).access_token;
      res.redirect("/users/kakao/member?access_token=" + accessToken);
    } else {
      console.log("왜 에러?");
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});

// 카카오 유저 정보 받아오기
userRouter.get("/kakao/member", async function (req, res) {
  const accessToken = req.query.access_token;
  var api_url = "https://kapi.kakao.com/v2/user/me";
  var header = "Bearer " + accessToken; // Bearer 다음에 공백 추가
  var options = {
    url: api_url,
    headers: { Authorization: header },
  };
  var request = require("request");
  request.get(options, async function (error, response, body) {
    try {
      if (!error && response.statusCode == 200) {
        console.log("카카오 유저 정보 받아오기 성공");
        const { id } = JSON.parse(body);
        const { nickname, profile_image } = JSON.parse(body).properties;
        const { email } = JSON.parse(body).kakao_account;
        console.log(
          `user info - id : ${id}, email : ${email}, nickname : ${nickname}, profile_img : ${profile_image}`
        );
        // DB 확인 후 로그인 처리
        await socialLogin(id, email, nickname, "kakao");
        setCookie(res, "accessToken", accessToken); // 쿠키에 액세스 토큰 저장
        return res.redirect(`${process.env.CLIENT_URL}/`); // 로그인 인증 완료
      } else {
        res.status(response.statusCode).end();
        console.log("error = " + response.statusCode);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "로그인 처리 error",
      });
    }
  });
});

export default userRouter;
