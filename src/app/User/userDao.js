export const selectUserById = async (client, id) => {
  const selectUserByIdQuery = `SELECT * FROM users WHERE id = $1`; // id로 사용자 정보를 가져오는 쿼리문을 정의합니다.
  try {
    const userInfo = await client.query(selectUserByIdQuery, [id]); // 쿼리문을 실행합니다.
    return userInfo.rows[0]; // 사용자 정보를 반환합니다.
  } catch (err) {
    console.error(err);
  }
};
