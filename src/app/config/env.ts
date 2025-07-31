import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config();

const envVariables = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
  DB_URL: str(),
});

export default envVariables;
