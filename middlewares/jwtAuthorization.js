import jwt from "jsonwebtoken";

export const jwtAuthorization = async (req, res, next) => {
  // accessToeken을 검증하는 미들웨어
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  // accessToken이 유효한지 확인
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Access token이 검증되지 않는 경우, 오류발생
      const refreshToken = req.headers["refresh-token"];

      // Refresh Token이 존재하지 않는 경우, 오류 발생
      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token is missing" });
      }

      // Refresh Token 유효성 검증
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        async (err, user) => {
          if (err) {
            // Refresh Token이 검증되지 않은 경우, 오류 발생
            return res
              .status(403)
              .json({ error: "Refresh token is not valid, login again" });
          }
          // 새로운 Access Token 발급
          const { accessToken, refreshToken } = await generateToken(user);
          console.log("새로운 Access Token 발급");
          res.locals.accessToken = accessToken;
          res.locals.refreshToken = refreshToken;
          res.locals.user = user;
          console.log(user);
          next(); // 새로운 Access Token 발급 후 next() 함수 호출
        }
      );
    } else {
      console.log("Access Token 유효");
      res.locals.accessToken = accessToken;
      res.locals.refreshToken = req.headers["refresh-token"];
      res.locals.user = user;
      console.log(user);
      next(); // Access Token 유효할 때도 next() 함수 호출
    }
  });
};

export const generateToken = async (user) => {
  // 토큰을 생성하는 함수
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, nickname: user.nickname },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, nickname: user.nickname },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
