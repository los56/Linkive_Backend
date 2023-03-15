import { getUserById, getUserByNickname, getUserByEmail } from "./userProvider";
import {
  createUser,
  changePassword,
  changeUserInfoService,
} from "./userService";
import bcrypt from "bcrypt";
import { generateToken } from "../../../middlewares/jwtAuthorization.js";

const jwt = require("jsonwebtoken");
require("dotenv").config();

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

export const changeUserInfo = async (req, res) => {
  // 유저 정보 변경하는 함수
  console.log("changeUserInfo 시작");
  const { nickname: newNickname, id: newId, password: newPassword } = req.body;
  const accessToken = res.locals.accessToken;
  const id = jwt.verify(accessToken, process.env.JWT_SECRET).id; // 토큰에서 id 추출
  try {
    await changeUserInfoService(id, newNickname, newId, newPassword);
    return res.status(200).json({ message: "User info changed" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "controller - changeUserInfo error" });
  }
};
