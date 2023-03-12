import express from "express";
import { sendVerifyEmail, sendEmailUserId } from "../../../utils/sendEmail";
import { login, signup } from "./userControllers";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.post("/verifyEmail/send", sendVerifyEmail); // 이메일 인증번호 보내기
userRouter.post("/findId", sendEmailUserId); // 아이디 찾기

// 소셜로그인 : 카카오, 네이버, 구글
// 회원탈퇴 : 이메일, 비밀번호 입력
// 아이디 찾기 : 이메일입력 -> 인증번호 보냄
// 비밀번호 찾기 : 아이디, 이메일입력 -> 인증번호 보냄 -> 변경할 비밀번호 입력

// 회원정보 변경 : 닉네임, 이메일, 비밀번호, 프로필사진
// 문의하기 : 이건 아닌거같은데 ?? 그냥 개발진 이메일만 보여주는 페이지인듯

export default userRouter;
