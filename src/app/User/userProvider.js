import pool from "../../../config/database";
import { selectUserById } from "./userDao";

// id로 사용자 정보를 가져오는 함수를 정의합니다.
export const getUserById = async (id) => {
  const client = await pool.connect(); // 클라이언트를 가져옵니다.
  try {
    const userInfo = await selectUserById(client, id); // 사용자 정보를 가져옵니다.
    if (!userInfo) {
      console.log("사용자 정보가 없습니다.");
    }
    return userInfo; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  } finally {
    client.release(); // 클라이언트를 반납합니다.
  }
};
