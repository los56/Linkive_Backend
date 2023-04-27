require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const checkAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  console.log("accessToken");
  console.log(accessToken);
  if (!accessToken) {
    return res.redirect(302, `${process.env.CLIENT_URL}/login`); // 액세스 토큰이 없으면 프론트엔드의 로그인 페이지로 리디렉션
  }
  try {
    // 토큰 유효성 검증 post 요청 보내기
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const payload = await response.json();
    console.log(payload);
    console.log(`당신은 ${payload.user_id} 유저입니다.`);
    next();
  } catch (err) {
    console.log(err);
    return res.redirect(302, `${process.env.CLIENT_URL}/login`); // 유효하지 않은 액세스 토큰이면 프론트엔드의 로그인 페이지로 리디렉션
  }
};

export default checkAuth;
