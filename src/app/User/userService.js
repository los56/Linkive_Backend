import pool from "../../../config/database";
import hashPassword from "../../../utils/hashPassword";

import { insertUser, saveUser, findUserById } from "./userDao";

export const createUser = async (newUser) => {
  const { id, password, email, nickname } = newUser;
  const client = await pool.connect();
  try {
    await insertUser(client, id, await hashPassword(password), email, nickname);
  } catch (err) {
    console.error(err);
  }
};

export const changePassword = async (id, newPassword) => {
  const client = await pool.connect();
  try {
    const user = await findUserById(client, id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "해당 id의 user가 존재하지 않습니다." });
    }
    user.password = await hashPassword(newPassword); // 비밀번호 변경
    await saveUser(client, user);
  } catch (err) {
    console.log("changePassword error");
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
};
