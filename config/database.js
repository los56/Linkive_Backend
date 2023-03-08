require("dotenv").config();

const { Pool } = require("pg");

// PostgreSQL 데이터베이스에 연결합니다.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;