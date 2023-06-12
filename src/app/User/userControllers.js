import { getUserById, getUserByNickname, getUserByEmail } from "./userProvider";
import {
  createUser,
  changePasswordService,
  changeUserInfoService,
  deleteUserService,
} from "./userService";
import bcrypt from "bcrypt";
import { setCookie, deleteCookie } from "../../../utils/cookie.js";
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
    // console.log(`accessToken: ${accessToken}`);
    // console.log(`refreshToken: ${refreshToken}`);
    // 토큰을 쿠키에 저장합니다.
    setCookie(res, "accessToken", accessToken);
    setCookie(res, "refreshToken", refreshToken);
    console.log(`로그인 완료`);
    return res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "로그인 server error" });
  }
};

// 로그아웃
export const logout = async (req, res) => {
  // 토큰을 쿠키에서 삭제합니다.
  deleteCookie(res);
  return res.status(200).json({ message: "로그아웃 성공" });
};

export const signup = async (req, res) => {
  // 회원가입하는 함수
  const { id, password, email, nickname } = req.body;
  const newUser = { id, password, email, nickname };
  console.log(newUser);

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

export const findPassword = async (req, res) => {
  // 비밀번호 찾는 함수
  const { id, newPassword } = req.body;
  const user = await getUserById(id);
  if (!user) {
    return res
      .status(401)
      .json({ message: "해당 id의 user가 존재하지 않습니다." });
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

export const changePassword = async (req, res) => {
  // 비밀번호 변경하는 함수
  const { id } = res.locals.user;
  const { password, newPassword } = req.body;

  const user = await getUserById(id);
  // 현재 비밀번호 확인
  if (!bcrypt.compareSync(password, user.password)) {
    return res
      .status(401)
      .json({ message: "현재 비밀번호가 일치하지 않습니다." });
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
  const { newNickname, newId, newPassword, newProfileImg } = req.body; // 프로필사진 추가
  const accessToken = res.locals.accessToken;
  const id = jwt.verify(accessToken, process.env.JWT_SECRET).id; // 토큰에서 id 추출
  try {
    await changeUserInfoService(
      id,
      newNickname,
      newId,
      newPassword,
      newProfileImg
    ); // 프로필사진 추가
    return res.status(200).json({
      message: "User info changed",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "controller - changeUserInfo error" });
  }
};

export const checkDuplicatedId = async (req, res) => {
  // 아이디 중복확인하는 함수
  const { newId } = req.body;
  if (!newId) {
    // 입력 아이디가 없으면
    return res.status(400).json({ message: "Id is required" });
  } else if (newId === res.locals.user.id) {
    // 현재 아이디와 동일한지 확인
    return res
      .status(409)
      .json({ message: "현재 아이디로 변경할 수 없습니다." });
  }
  try {
    const user = await getUserById(newId);
    if (user) {
      return res.status(409).json({ message: "Id already exists" });
    } else {
      return res.status(200).json({ message: "Id available" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkCurrentPw = async (req, res) => {
  // 현재 비밀번호가 일치하는지 확인하는 함수
  const { currentPassword } = req.body;
  const id = res.locals.user.id; // 토큰에서 id 추출
  const user = await getUserById(id);
  // 비밀번호 일치 확인
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res
      .status(401)
      .json({ message: "현재 비밀번호와 일치하지 않습니다." });
  }
  return res.status(200).json({ message: "현재 비밀번호와 일치합니다." });
};

export const deleteUser = async (req, res) => {
  const id = res.locals.user.id; // 토큰에서 id 추출
  const user = await getUserById(id);
  const { email, password } = req.body;
  if (user.email !== email) {
    return res.status(404).json({ message: "이메일이 일치하지 않습니다." });
  } else if (!bcrypt.compareSync(password, user.password)) {
    return res.status(1401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  try {
    await deleteUserService(id);
    deleteCookie(res);
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const socialLogin = async (
  id,
  email,
  nickname,
  platform,
  profile_img_url
) => {
  // 가입유저인지 DB 확인
  try {
    const exUser = await getUserById(id);
    if (exUser) {
      // 가입된 유저면 pass
      console.log("이미 가입된 유저");
    } else {
      // 새로운 유저면 생성
      const newUser = await createUser({
        id,
        email,
        nickname,
        password: null,
        socialLogin: platform,
        profile_img_url,
      });
      console.log("새로운 유저 생성");
    }
    // 토큰 발급
    const token = generateToken({ id, email, nickname });
    return token;
  } catch (err) {
    console.error(err);
  }
};

export const getUserInfoByToken = async (req, res) => {
  const client = await pool.connect(); // 클라이언트를 가져옵니다.
  try {
    const id = res.locals.user.id;
    let userInfo = await getUserById(id);
    userInfo = {
      // 필요한 정보만 추출
      id: userInfo.id,
      nickname: userInfo.nickname,
      email: userInfo.email,
      profile_img_url: userInfo.profile_img_url,
      socialLogin: userInfo.socialLogin,
    };
    return res.status(200).json({ userInfo });
  } catch (err) {
    console.log("getUserInfoByToken error");
    console.error(err);
  } finally {
    client.release(); // 클라이언트를 반납합니다.
  }
};

export const getProfileImg = async (req, res) => {
  const { id } = res.locals.user;
  const user = await getUserById(id);
  const profileImg = user.profile_img_url;
  return res.status(200).json({ profileImg });
};
