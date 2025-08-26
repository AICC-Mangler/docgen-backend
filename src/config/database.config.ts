import { config } from 'dotenv';

// .env 파일 로드 (기본적으로 프로젝트 루트의 .env 파일을 찾음)
config();

export const databaseConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};
