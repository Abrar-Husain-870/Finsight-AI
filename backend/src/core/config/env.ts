import { cleanEnv, str, port, url } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: port({ default: 3001 }),
  DATABASE_URL: url(),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  GOOGLE_CLIENT_ID: str({ default: '' }),
  GOOGLE_CLIENT_SECRET: str({ default: '' }),
  ENCRYPTION_KEY: str(),
  FRONTEND_URL: url(),
});
