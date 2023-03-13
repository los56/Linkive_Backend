import {
  isNotAccessTokenExpired,
  refreshJWT,
} from "../src/app/User/userControllers";

export const jwtAthorization = async (req, res, next) => {
  // accessToeken을 검증하는 미들웨어
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Access token not provided" });
  }
  const id = isNotAccessTokenExpired(accessToken); // access 토큰이 만료되었는지 확인합니다.
  if (!id) {
    refreshJWT(req, res); // refresh 토큰으로 access 토큰을 재발급합니다.
  }
  req.id = id;
  console.log("jwtAthorization 성공");
  next(); // req.id에 user id를 넣어줍니다.
};
