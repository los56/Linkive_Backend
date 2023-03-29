import pool from "../../../config/database";
import { findUserById, findUserByEmail, findUserByNickname } from "./userDao";

// id로 사용자 정보를 가져오는 함수를 정의합니다.
export const getUserById = async (id) => {
  const client = await pool.connect(); // 클라이언트를 가져옵니다.
  try {
    console.log("getUserById 시작");
    const userInfo = await findUserById(client, id); // 사용자 정보를 가져옵니다.
    if (!userInfo) {
      return null;
    }
    return userInfo; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  } finally {
    client.release(); // 클라이언트를 반납합니다.
  }
};

// email로 사용자 정보를 가져오는 함수를 정의합니다.
export const getUserByEmail = async (email) => {
  const client = await pool.connect(); // 클라이언트를 가져옵니다.
  try {
    const userInfo = await findUserByEmail(client, email); // 사용자 정보를 가져옵니다.
    if (!userInfo) {
      return null;
    }
    return userInfo; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  } finally {
    client.release(); // 클라이언트를 반납합니다.
  }
};

// nickname으로 사용자 정보를 가져오는 함수를 정의합니다.
export const getUserByNickname = async (nickname) => {
  const client = await pool.connect(); // 클라이언트를 가져옵니다.
  try {
    const userInfo = await findUserByNickname(client, nickname); // 사용자 정보를 가져옵니다.
    if (!userInfo) {
      return null;
    }
    return userInfo; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  } finally {
    client.release(); // 클라이언트를 반납합니다.
  }
};
