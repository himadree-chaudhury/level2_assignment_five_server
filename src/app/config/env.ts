import dotenv from "dotenv";
import { cleanEnv, num, port, str } from "envalid";

dotenv.config();

const envVariables = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
  DB_URL: str(),
  EXPRESS_SESSION_SECRET: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_TOKEN_EXPIRATION: str(),
  JWT_REFRESH_TOKEN_EXPIRATION: str(),
  BCRYPT_SALT_ROUNDS: num(),
  REDIS_USERNAME: str(),
  REDIS_PASSWORD: str(),
  REDIS_HOST: str(),
  REDIS_PORT: port(),
});

export default envVariables;
