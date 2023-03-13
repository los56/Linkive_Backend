import express from "express";
import cors from "cors";
require("dotenv").config(); // .env 파일을 읽어서 process.env에 넣어줌
import morgan from "morgan"; // 로그를 남기는 미들웨어
import pool from "./config/Database"; // 데이터베이스 연결을 위한 pool을 가져옵니다.
import userRouter from "./src/app/User/userRouter"; // userRouter를 가져옵니다.
import generateToken from "./utils/generateToken"; // 토큰을 생성하는 함수를 가져옵니다.

const app = express();
const logger = morgan("dev");

// 기본설정
app.use(express.json()); // json 형태의 데이터를 받기 위해
app.use(express.urlencoded({ extended: false })); // form 데이터를 받기 위해
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    // credentials: true,
  })
); // cors 설정
app.use(logger); // 로그를 남기기 위해

// 라우터 설정
app.use("/users", userRouter);

// 서버 실행
app.listen(process.env.PORT, () => {
  console.log(`server is on ${process.env.PORT}`);
});

// 데이터베이스 연결 상태를 확인합니다.
pool
  .connect()
  .then((client) => {
    console.log("데이터베이스와 연결되었습니다.");
    client.release(); // 클라이언트를 반환합니다.
  })
  .catch((err) => {
    console.error("데이터베이스 연결 오류:", err.message);
  })
  .finally(() => {
    pool.end(); // 데이터베이스 연결을 종료합니다.
  });
