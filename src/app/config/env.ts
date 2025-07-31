import dotenv from "dotenv";
import { cleanEnv, num, port, str } from "envalid";

dotenv.config();

const envVariables = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
  DB_URL: str(),
  EXPRESS_SESSION_SECRET: str(),
  JWT_SECRET: str(),
  JWT_EXPIRATION: str(),
  BCRYPT_SALT_ROUNDS: num(),
});

export default envVariables;
