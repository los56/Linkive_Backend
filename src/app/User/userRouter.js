require("dotenv").config();

import express from "express";
const request = require("request");
import { sendVerifyEmail, sendEmailUserId } from "../../../utils/sendEmail";
import { setCookie } from "../../../utils/cookie";
import {
  login,
  logout,
  signup,
  findPassword,
  changeUserInfo,
  deleteUser,
  socialLogin,
  getUserInfoByToken,
  checkDuplicatedId,
  checkCurrentPw,
  getProfileImg,
  checkIdwithEmail,
  checkIsEmail,
  checkNewId,
  checkValidEmail,
} from "./userControllers";
import { jwtAuthorization } from "../../../middlewares/jwtAuthorization";
import { oauth2Client, authorizationUrl } from "../../../config/oauth";
import checkAuth from "../../../middlewares/checkAuth";

const userRouter = express.Router();

// 프론트에서 호출하는 API
userRouter.post("/login", login);
userRouter.delete("/logout", logout);
userRouter.post("/signup", signup);
userRouter.post("/delete", jwtAuthorization, deleteUser); // 회원탈퇴
userRouter.post("/verifyEmail/send", sendVerifyEmail); // 이메일 인증번호 보내기
userRouter.post("/findId", sendEmailUserId); // 아이디 찾기
userRouter.post("/findPassword", findPassword); // 비밀번호 찾기
// userRouter.post("/changePassword", jwtAuthorization, changePassword); // 비밀번호 변경
userRouter.patch("/changeUserInfo", jwtAuthorization, changeUserInfo); // 회원정보 변경, to do : 프로필사진변경
userRouter.post("/checkNewId", checkNewId); // 회원가입할 때 아이디 중복확인")
userRouter.post("/checkDuplicatedId", jwtAuthorization, checkDuplicatedId); // 유저변경할 때 아이디 중복확인
userRouter.post("/checkCurrentPw", jwtAuthorization, checkCurrentPw); // 현재 비밀번호 확인
userRouter.get("/profileImg", jwtAuthorization, getProfileImg); // 유저 프로필이미지 return
userRouter.get("/userInfo", jwtAuthorization, getUserInfoByToken); // 회원정보 조회
userRouter.post("/checkIdwithEmail", checkIdwithEmail); // 아이디와 이메일이 일치하는지 확인
userRouter.post("/checkIsEmail", checkIsEmail); // 해당 이메일로 가입된 아이디가 있는지 확인
userRouter.post("/checkValidEmail", checkValidEmail); // 해당 이메일로 가입된 아이디가 있는지 확인

// 테스트용 API
userRouter.get("/jwtAuthorization", jwtAuthorization, (req, res) => {
  // jwt 토큰 인증 테스트
  console.log("jwtAuthorization");
  return res.status(200).json({
    message: "good",
  });
});
userRouter.get("/checkAuth", checkAuth, (req, res) => {
  // checkAuth 테스트
  return res.redirect(302, `${process.env.WEB_URL}/`);
});

// 소셜로그인 : 구글
userRouter.get("/auth/google", (req, res) => {
  res.writeHead(301, { Location: authorizationUrl });
  res.end();
});
// 구글 로그인 콜백
userRouter.get("/auth/google/callback", async (req, res, next) => {
  const url = require("url");
  // Receive the callback from Google's OAuth 2.0 server.
  if (req.url.startsWith("/auth/google/callback")) {
    let userCredential = null; // 구글 로그인 유저 정보
    // Handle the OAuth 2.0 server response
    let q = url.parse(req.url, true).query;
    if (q.error) {
      // An error response e.g. error=access_denied
      console.log("Error:" + q.error);
    } else {
      // Get access and refresh tokens (if access_type is offline)
      let { tokens } = await oauth2Client.getToken(q.code); // access_token, scope, token_type, id_token, expiry_date
      oauth2Client.setCredentials(tokens); // API 접근을 위해 인증 토큰 설정

      // Get the user's profile information
      let userInfo = await oauth2Client.request({
        url: "https://www.googleapis.com/oauth2/v2/userinfo",
      });
      userCredential = userInfo.data;
      const { id, email, name, picture } = userCredential; // 필요한 정보만 추출

      // 로그인 처리
      try {
        const jwtTokens = await socialLogin(id, email, name, "google", picture);
        setCookie(res, "accessToken", jwtTokens.accessToken); // 쿠키에 jwt 토큰 저장
        setCookie(res, "refreshToken", jwtTokens.refreshToken); // 쿠키에 리프레시 토큰 저장
        return res.redirect(`${process.env.WEB_URL}/`); // 로그인 인증 완료, 홈으로 redirect
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
  const api_url = // 네이버 로그인 인증 요청
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    process.env.NAVER_CLIENT_ID +
    "&redirect_uri=" +
    process.env.NAVER_REDIRECT_URL +
    "&state=" +
    Math.random().toString(36).substr(3, 14);
  res.writeHead(301, { Location: api_url }); // redirect
  res.end();
});
// 네이버 로그인 콜백
userRouter.get("/auth/naver/callback", async (req, res, next) => {
  const code = req.query.code;
  const state = req.query.state;
  const api_url = // 네이버 로그인 토큰 요청 API
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
  const options = {
    url: api_url,
    headers: {
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
    },
  };
  // 네이버 로그인 토큰 요청
  request.get(options, function (error, response, body) {
    console.log(`토큰 : ${body}`); // access_token, refresh_token, token_type, expires_in 1H
    if (!error && response.statusCode == 200) {
      // 토큰 요청 성공
      const accessToken = JSON.parse(body).access_token;
      // 네이버 유저 정보 요청 라우터로 redirect
      res.redirect("/api/users/naver/member?access_token=" + accessToken);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode, error);
    }
  });
});
// naver 유저 정보 받아오기
userRouter.get("/naver/member", async (req, res) => {
  const accessToken = req.query.access_token;
  const api_url = "https://openapi.naver.com/v1/nid/me"; // 네이버 유저 정보 요청 API
  const header = "Bearer " + accessToken; // Bearer 다음에 공백 추가
  const options = {
    url: api_url,
    headers: { Authorization: header },
  };
  // 네이버 유저 정보 요청
  request.get(options, async function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // 유저 정보 요청 성공
      const { id, email, nickname, profile_image } = JSON.parse(body).response;
      // DB 확인 후 로그인 처리
      try {
        const tokens = await socialLogin(
          id,
          email,
          nickname,
          "naver",
          profile_image
        );
        setCookie(res, "accessToken", tokens.accessToken); // 쿠키에 jwt 토큰 저장
        setCookie(res, "refreshToken", tokens.refreshToken); // 쿠키에 리프레시 토큰 저장
        return res.redirect(`${process.env.WEB_URL}/`); // 로그인 인증 완료, 홈으로 redirect
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
  const api_url = // 카카오 로그인 인증 요청 API
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
  const api_url = // 카카오 로그인 토큰 요청 API
    "https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=" +
    process.env.KAKAO_CLIENT_ID +
    "&redirect_uri=" +
    process.env.KAKAO_REDIRECT_URL +
    "&code=" +
    code +
    "&client_secret=" +
    process.env.KAKAO_CLIENT_SECRET;
  const options = {
    url: api_url,
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  };
  // 카카오 로그인 토큰 요청
  request.post(options, function (error, response, body) {
    console.log(`토큰 : ${body}`);
    if (!error && response.statusCode == 200) {
      // 토큰 요청 성공
      const accessToken = JSON.parse(body).access_token;
      // 카카오 유저 정보 요청 라우터로 redirect
      res.redirect("/api/users/kakao/member?access_token=" + accessToken);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});

// 카카오 유저 정보 받아오기
userRouter.get("/kakao/member", async function (req, res) {
  const accessToken = req.query.access_token;
  var api_url = "https://kapi.kakao.com/v2/user/me"; // 카카오 유저 정보 요청 API
  var header = "Bearer " + accessToken; // Bearer 다음에 공백 추가
  var options = {
    url: api_url,
    headers: { Authorization: header },
  };
  // 카카오 유저 정보 요청
  request.get(options, async function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // 유저 정보 요청 성공
      const { id } = JSON.parse(body);
      const { nickname, profile_image } = JSON.parse(body).properties;
      const { email } = JSON.parse(body).kakao_account;
      // DB 확인 후 로그인 처리
      try {
        const tokens = await socialLogin(
          id,
          email,
          nickname,
          "kakao",
          profile_image
        );
        setCookie(res, "accessToken", tokens.accessToken); // 쿠키에 jwt 토큰 저장
        setCookie(res, "refreshToken", tokens.refreshToken); // 쿠키에 리프레시 토큰 저장
        return res.redirect(`${process.env.WEB_URL}/`); // 로그인 인증 완료, 홈으로 redirect
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

export default userRouter;
