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

  const { email } = req.body; // 유저가 입력한 이메일

  if (await getUserByEmail(email)) {
    return res.status(401).json({ message: "이미 가입된 이메일입니다." });
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

    // 이메일 전송
    const result = await transporter.sendMail(mailOptions);
    console.log(result);
    res.status(200).json({ message: "이메일이 전송되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to Send verification email" });
  }
};

export const verifyEmailCode = async (req, res) => {
  // const { email, verifycationCode } = req.body;
  // try {
  //   const user = await getUserByEmail(email);
  //   if (!user) {
  //     return res.status(401).json({ message: "해당 이메일의 user가 존재하지 않습니다." });
  //   }
  //   if (user.verifycationCode !== verifycationCode) {
  //     return res.status(401).json({ message: "인증코드가 일치하지 않습니다." });
  //   }
  //   await verifyUser(email);
  //   return res.status(200).json({ message: "이메일 인증에 성공했습니다." });
};
