require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
import { getUserById } from "../src/app/User/userProvider";

const checkAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const issuer = req.cookies.issuer;
  console.log(`accessToken : ${accessToken}`);
  if (!accessToken) {
    console.log("로그인 하세요");
    return res.redirect(302, `${process.env.CLIENT_URL}/login`); // 액세스 토큰이 없으면 프론트엔드의 로그인 페이지로 리디렉션
  }
  let response = undefined;
  let id, nickname, email, profileImage;
  try {
    // 토큰 유효성 검증 post 요청 보내기
    switch (issuer) {
      case "google":
        console.log("구글 토큰 유효성 검증 ...");
        response = await fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        break;
      case "kakao":
        console.log("카카오 토큰 유효성 검증 ...");
        response = await fetch(
          // 카카오 토큰 유효성 검증
          `https://kapi.kakao.com/v2/user/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        break;
      case "naver":
        console.log("네이버 토큰 유효성 검증 ...");
        response = await fetch(
          // 네이버 토큰 유효성 검증
          `https://openapi.naver.com/v1/nid/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        break;
      default:
        console.log("issuer가 올바르지 않습니다.");
        return res.redirect(302, `${process.env.CLIENT_URL}/login`);
    }
  } catch (err) {
    console.log(err);
    return res.redirect(302, `${process.env.CLIENT_URL}/login`); // 유효하지 않은 액세스 토큰이면 프론트엔드의 로그인 페이지로 리디렉션
  }
  const payload = await response.json();
  console.log(payload);
  switch (issuer) {
    case "google":
      id = payload.user_id;
      nickname = payload.name;
      email = payload.email;
      profileImage = payload.picture;
      break;
    case "kakao":
      id = payload.id;
      nickname = payload.properties.nickname;
      email = payload.kakao_account.email;
      profileImage = payload.properties.profile_image;
      break;
    case "naver":
      id = payload.response.id;
      nickname = payload.response.nickname;
      email = payload.response.email;
      profileImage = payload.response.profile_image;
      break;
    default:
      console.log("issuer가 올바르지 않습니다.");
  }

  console.log(`${nickname}님, 당신의 id는 ${id} 입니다.`);

  // 유저정보
  const user = await getUserById(payload.user_id);
  console.log(user);

  next();
};

export default checkAuth;
