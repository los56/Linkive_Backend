import { getUserById } from "./userProvider";
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = async (user) => {
  // 토큰을 생성하는 함수
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const login = async (req, res) => {
  // id와 password로 로그인하는 함수
  const { id, password } = req.body;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.password !== password) {
      console.log("비밀번호가 일치하지 않습니다.");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { accessToken, refreshToken } = await generateToken(user); // 토큰을 생성합니다.
    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const isAccessTokenExpired = (accessToken) => {
  // access 토큰이 만료되었는지 확인하는 함수
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const { exp } = decoded;
    const now = Date.now() / 1000;
    return now >= exp;
  } catch (err) {
    return true;
  }
};

export const refreshJWT = async (req, res) => {
  // refresh 토큰으로 access 토큰을 재발급하는 함수
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { accessToken, newRefreshToken: refreshToken } = await generateToken(
      user
    );
    refreshToken = newRefreshToken;
    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logout = (req, res) => {};
