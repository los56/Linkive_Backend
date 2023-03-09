import bcrypt from "bcrypt";

const hashPassword = (password) => {
  // 비밀번호를 해시화하는 함수
  return bcrypt.hash(password, 5);
};

export default hashPassword;
