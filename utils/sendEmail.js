import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { getUserByEmail, getUserById } from "../src/app/User/userProvider";

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
  } else if (emailAuthType === "findId") {
    // 아아디 찾기 할 때의 이메일 인증
    if (!(await getUserByEmail(email))) {
      return res.status(409).json({ message: "가입되지 않은 이메일입니다." });
    }
  } else if (emailAuthType == "findPw") {
      // 비밀번호 찾기 할 때의 이메일 인증
    const { id } = req.body;
    const user = await getUserById(id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "해당 id의 user가 존재하지 않습니다." });
    }
    if (user.email !== email) {
      return res.status(409).json({ message: "아이디와 이메일이 일치하지 않습니다" });
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

    return res.status(200).json({ verificationCode });  // 클라이언트에게 인증코드를 주고 클라이언트에서 이 코드와 유저가 입력한 코드가 같으면 인증성공 시키기
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendEmailUserId = async (req, res) => {
  const email = req.body.email;
  const userInfo = await getUserByEmail(email);

  try {
    const mailOptions = {
      from: "from 이메일",
      to: email,
      subject: "아이디 찾기",
      html: `<h1>당신의 아이디는 ${userInfo.id}입니다.</h1>`,
    };

    await transporter.sendMail(mailOptions); // 이메일 전송

    return res.status(200).json({ message: "이메일로 userId 전송 성공" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
