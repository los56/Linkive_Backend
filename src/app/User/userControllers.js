import { getUserById, getUserByNickname, getUserByEmail } from "./userProvider";
import {
  createUser,
  changePasswordService,
  changeUserInfoService,
  deleteUserService,
} from "./userService";
import bcrypt from "bcrypt";
import { generateToken } from "../../../middlewares/jwtAuthorization.js";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
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

export const changePassword = async (req, res) => {
  // 비밀번호 변경하는 함수
  const { id, newPassword } = req.body;
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
  try {
    await deleteUserService(id);
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Google oauth
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID, // .env 파일에서 클라이언트 ID 값을 읽어옵니다.
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8123/users/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log("google profile : ", profile);
    try {
      const exUser = await getUserById(profile.id); // 이미 가입된 유저인지 확인
      if (exUser) {
        done(null, exUser); // 이미 가입된 유저면 done
      } else {
        const newUser = await createUser({
          id: profile.id,
          password: profile.id,
          email: profile?.emails[0].value,
          nickname: profile.displayName,
          socialLogin: "google",
        }); // 새로운 유저면 생성
        done(null, newUser); // 회원가입하고 로그인 인증 완료
      }
    } catch (err) {
      console.error(err);
      done(err);
    }
  }
);
// Passport에 Google 전략 등록
passport.use("google", googleStrategy);
