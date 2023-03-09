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

export const getAccessToken = (req, res, next) => {};

export const getRfreshToken = (req, res) => {};

export const loginSuccess = (req, res) => {};

export const logout = (req, res) => {};
