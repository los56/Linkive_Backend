import { getUserById, getUserByNickname, getUserByEmail } from "./userProvider";
import {
  createUser,
  changePasswordService,
  changeUserInfoService,
  deleteUserService,
} from "./userService";
import bcrypt from "bcrypt";
import { generateToken } from "../../../middlewares/jwtAuthorization.js";
const jwt = require("jsonwebtoken");
import pool from "../../../config/database.js";
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

export const changePassword = async (req, res) => {
  // 비밀번호 변경하는 함수
  const { id, email, newPassword } = req.body;
  const user = await getUserById(id);
  if (!user) {
    return res
      .status(401)
      .json({ message: "해당 id의 user가 존재하지 않습니다." });
  } else if (user.email !== email) {
    return res.status(401).json({ message: "이메일이 일치하지 않습니다." });
  }
  try {
    await changePasswordService(id, newPassword);
    return res.status(200).json({ message: "Password changed" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "controller Internal server error" });
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
    return res.status(200).json({
      accessToken: res.locals.accessToken,
      refreshToken: res.locals.refreshToken,
      message: "User info changed",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "controller - changeUserInfo error" });
  }
};

export const deleteUser = async (req, res) => {
  const id = jwt.verify(res.locals.accessToken, process.env.JWT_SECRET).id; // 토큰에서 id 추출
  const user = await getUserById(id);
  const { email, password } = req.body;
  if (user.email !== email) {
    return res.status(401).json({ message: "이메일이 일치하지 않습니다." });
  } else if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  try {
    await deleteUserService(id);
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const socialLogin = async (id, email, nickname, platform) => {
  // DB 확인 후 로그인 처리
  try {
    const exUser = await getUserById(id); // 이미 가입된 유저인지 확인
    if (exUser) {
      console.log("이미 가입된 유저");
    } else {
      const newUser = await createUser({
        id,
        email,
        nickname: nickname,
        password: null,
        socialLogin: platform,
      }); // 새로운 유저면 생성
      console.log("새로운 유저 생성");
    }
  } catch (err) {
    console.error(err);
    // return next(err);
  }
};

export const getUserInfoByToken = async (req, res, next) => {
  const client = await pool.connect(); // 클라이언트를 가져옵니다.
  try {
    // accessToken 파싱
    let accessToken = '';
    accessToken = req.cookies.accessToken;
    console.log("accessToken : ", accessToken);
    
    if (!accessToken) {
      // 리다이렉트
      return res.status(302).end();

    }
    
    // 네이버 로그인인 경우



    // const userInfo = await findUserByToken(client, token); // 사용자 정보를 가져옵니다.
    // if (!userInfo) {
    //   return null;
    // }
    // return userInfo; // 사용자 정보를 반환합니다.
    return res.end();
  } catch (err) {
    console.error(err);
  } finally {
    client.release(); // 클라이언트를 반납합니다.
  }
}
