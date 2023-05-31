import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  // 비밀번호를 해시화하는 함수
  const salt = await bcrypt.genSalt(5); // 랜덤한 솔트 값을 생성합니다.
  const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호를 해시화합니다.
  return hashedPassword;
};

export default hashPassword;
