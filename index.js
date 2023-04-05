import express from "express";
import cors from "cors";
require("dotenv").config(); // .env 파일을 읽어서 process.env에 넣어줌
import morgan from "morgan"; // 로그를 남기는 미들웨어
import pool from "./config/database"; // 데이터베이스 연결을 위한 pool을 가져옵니다.
import userRouter from "./src/app/User/userRouter"; // userRouter를 가져옵니다.
import passport from "passport";
const app = express();
const logger = morgan("dev");
const session = require("express-session");

// 기본설정
app.use(express.json()); // json 형태의 데이터를 받기 위해
app.use(express.urlencoded({ extended: false })); // form 데이터를 받기 위해
app.use(cors()); // cors 설정
app.use(logger); // 로그를 남기기 위해
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true); // credentials 옵션을 true로 설정합니다.
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Passport 초기화
app.use(passport.initialize());

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

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
  });
// .finally(() => {
//   pool.end(); // 데이터베이스 연결을 종료합니다.
// });
