import { config } from 'dotenv';

// .env 파일 로드 (기본적으로 프로젝트 루트의 .env 파일을 찾음)
config();

// 환경 변수 디버깅
console.log('=== 환경 변수 디버깅 ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[HIDDEN]' : 'undefined');
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_SCHEMA:', process.env.DB_SCHEMA);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('========================');

export const databaseConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};
