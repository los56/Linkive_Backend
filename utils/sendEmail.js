import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { getUserByEmail } from "../src/app/User/userProvider";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerifyEmail = async (req, res) => {
  // nodemailer 모듈을 사용하여 이메일을 전송합니다.

  const { email } = req.body; // 유저의 이메일을 받아옵니다.
  const emailAuthType = req.headers["email-auth-type"]; // 이메일 인증 타입을 받아옵니다.

  if (emailAuthType === "create") {
    // 회원가입 할 때의 이메일 인증
    if (await getUserByEmail(email)) {
      return res.status(409).json({ message: "이미 가입된 이메일입니다." });
    }
  } else if (emailAuthType === "find") {
    // 아아디/비밀번호 찾기 할 때의 이메일 인증
    if (!(await getUserByEmail(email))) {
      return res.status(409).json({ message: "가입되지 않은 이메일입니다." });
    }
  } else {
    return res.status(400).json({ message: "이메일 인증 타입이 없습니다." });
  }

  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6자리 인증코드 생성

    // 이메일 전송 옵션
    const mailOptions = {
      from: "from 이메일",
      to: email,
      subject: "이메일 인증",
      html: `<h1>다음 이메일 인증 번호를 입력해주세요.</h1><h2>${verificationCode}<h2>`,
    };

    await transporter.sendMail(mailOptions); // 이메일 전송

    return res.status(200).json({ verificationCode });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
