import pool from "../../../config/database";

import {
  findUserByEmail,
  findUserById,
  findUserByNickname,
  insertUser,
} from "./userDao";

export const createUser = async (newUser) => {
  const client = await pool.connect();
  const { id, password, email, nickname } = newUser;
  try {
    insertUser(client, id, password, email, nickname);
  } catch (err) {
    console.error(err);
  }
};
