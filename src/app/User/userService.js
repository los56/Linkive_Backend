import pool from "../../../config/database";

import { insertUser, saveUser, findUserById, deleteUserById } from "./userDao";
import { getUserById } from "./userProvider";
import hashPassword from "../../../utils/hashPassword";

export const createUser = async (newUser) => {
  const { id, email, nickname, password=null, socialLogin=null } = newUser;
  const client = await pool.connect();
  try {
    if (password === null) {
      await insertUser(client, id, password, email, nickname, socialLogin);
    } else {
    await insertUser(client, id, await hashPassword(password), email, nickname, socialLogin);
    }
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
};

export const changePasswordService = async (id, newPassword) => {
  const client = await pool.connect();
  try {
    const user = await findUserById(client, id);
    if (!user) {
      throw new Error("존재하지 않는 사용자입니다.");
    }
    user.password = newPassword; // 비밀번호 변경
    await saveUser(client, user);
  } catch (err) {
    console.log("changePassword error");
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
};

export const changeUserInfoService = async (
  id,
  newNickname,
  newId,
  newPassword
) => {
  console.log("changeUserInfoService 시작");
  console.log("id", id);
  const userInfo = await getUserById(id);
  console.log("기존 유저 정보", userInfo);

  const user = {
    users_num: userInfo.users_num,
    nickname: newNickname,
    id: newId,
    password: newPassword,
  };

  console.log("바꿀 정보", user);
  const client = await pool.connect();
  try {
    console.log("changeUserInfoService try");
    await saveUser(client, user);
  } catch (err) {
    console.log("changeUserInfoService error");
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
};

export const deleteUserService = async (id) => {
  const client = await pool.connect();
  try {
    await deleteUserById(client, id);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
};
