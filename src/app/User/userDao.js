import hashPassword from "../../../utils/hashPassword.js";

export const findUserById = async (client, id) => {
  const findUserByIdQuery = `SELECT * FROM users WHERE id = $1`; // id로 사용자 정보를 가져오는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(findUserByIdQuery, [id]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  }
};

export const findUserByEmail = async (client, email) => {
  const findUserByEmailQuery = `SELECT * FROM users WHERE email = $1`; // email로 사용자 정보를 가져오는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(findUserByEmailQuery, [email]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  }
};

export const findUserByNickname = async (client, nickname) => {
  const findUserByNicknameQuery = `SELECT * FROM users WHERE nickname = $1`; // nickname으로 사용자 정보를 가져오는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(findUserByNicknameQuery, [nickname]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  }
};

export const authenticateUser = async (client, id, password) => {
  const authenticateUserQuery = `SELECT * FROM users WHERE id = $1 AND password = $2`; // id와 password로 사용자 정보를 가져오는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(authenticateUserQuery, [id, password]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  }
};

export const insertUser = async (
  client,
  id,
  password,
  email,
  nickname,
  socialLogin,
  profile_img_url
) => {
  const insertUserQuery = `INSERT INTO users(id, password, email, nickname, socialLogin,profile_img_url) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`; // 사용자 정보를 생성하는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(insertUserQuery, [
      id,
      password,
      email,
      nickname,
      socialLogin,
      profile_img_url
    ]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  }
};

export const saveUser = async (client, user) => {
  console.log("saveUser 시작");
  const saveUserQuery = `UPDATE users SET nickname = $1, id = $2, password = $3, profile_img_url = $4 WHERE users_num = $5`;
  try {
    await client.query(saveUserQuery, [
      user.nickname,
      user.id,
      await hashPassword(user.password),
      user.profile_img_url,
      user.users_num,
    ]); // 쿼리문을 실행합니다.
    console.log("saveUser 성공");
  } catch (err) {
    console.log("saveUser error");
    console.error(err);
    throw err;
  }
};

export const deleteUserById = async (client, id) => {
  const deleteUserByIdQuery = `DELETE FROM users WHERE id = $1`; // id로 사용자 정보를 삭제하는 쿼리문을 정의합니다.
  try {
    await client.query(deleteUserByIdQuery, [id]); // 쿼리문을 실행합니다.
  } catch (err) {
    console.error(err);
    throw err;
  }
};
