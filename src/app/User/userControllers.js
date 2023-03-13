import { getUserById, getUserByNickname, getUserByEmail } from "./userProvider";
import { createUser, changePassword } from "./userService";
import bcrypt from "bcrypt";

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
      return res
        .status(401)
        .json({ message: "해당 id의 user가 존재하지 않습니다." });
    }

    // 비밀번호가 일치하는지 확인합니다.
    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // 토큰을 생성합니다.
    const { accessToken, refreshToken } = await generateToken(user);
    return res.status(200).json({ accessToken, refreshToken });
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
    return res.status(401).json({ message: "Refresh token not provided" }); // refreshToken이 없음
  }
  try {
    // refreshToken이 유효한지 확인
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { accessToken, refreshToken } = await generateToken(user); // 에러날수도있음 refreshToken 중복
    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Invalid refresh token" }); // refreshToken 만료, 다시 로그인 해야함
    // 프론트에서 토큰을 삭제, 로그인 페이지로 이동
  }
};

export const signup = async (req, res) => {
  // 회원가입하는 함수
  const { id, password, email, nickname } = req.body;
  const newUser = { id, password, email, nickname };

  if (await getUserByNickname(nickname)) {
    // 닉네임이 중복되는지 확인
    return res.status(409).json({ message: "Nickname already exists" });
  } else if (await getUserByEmail(email)) {
    // 이메일이 중복되는지 확인
    return res.status(409).json({ message: "Email already exists" });
  } else if (await getUserById(id)) {
    // 아이디가 중복되는지 확인
    return res.status(409).json({ message: "Id already exists" });
  }
  try {
    await createUser(newUser);
    return res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changePasswordC = async (req, res) => {
  // 비밀번호 변경하는 함수
  const { id, newPassword } = req.body;
  try {
    await changePassword(id, newPassword);
    return res.status(200).json({ message: "Password changed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
