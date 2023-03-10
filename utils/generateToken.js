// 회원가입시 토큰 생성 함수
import crypto from "crypto";

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

export default generateToken;
