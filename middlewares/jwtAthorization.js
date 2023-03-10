import {
  isAccessTokenExpired,
  refreshJWT,
} from "../src/app/User/userControllers";

export const jwtAthorization = async (req, res, next) => {
  // accessToeken을 검증하는 미들웨어
  const accessToken =
    req.headers["x-access-token"] || req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Access token not provided" });
  }
  if (isAccessTokenExpired(accessToken)) {
    // access 토큰이 만료되었는지 확인합니다.
    refreshJWT(); // refresh 토큰으로 access 토큰을 재발급합니다.
  }
  next();
};
