import { config } from 'dotenv';

// .env 파일 로드
config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-2025',
  expiresIn: process.env.JWT_EXPIRES_IN || '10m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '6h',
};

export const JWT_MODULE_OPTIONS = {
  secret: jwtConfig.secret,
  signOptions: {
    expiresIn: jwtConfig.expiresIn,
  },
};
