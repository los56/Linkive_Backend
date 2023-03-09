import pool from "../../../config/database";
import hashPassword from "../../../utils/hashPassword";

import { insertUser } from "./userDao";

export const createUser = async (newUser) => {
  const { id, password, email, nickname } = newUser;
  const client = await pool.connect();
  try {
    await insertUser(client, id, await hashPassword(password), email, nickname);
  } catch (err) {
    console.error(err);
  }
};
