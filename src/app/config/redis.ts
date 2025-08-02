import { createClient } from "redis";
import { CustomError } from "../utils/error";
import envVariables from "./env";

export const redisClient = createClient({
  username: envVariables.REDIS_USERNAME,
  password: envVariables.REDIS_PASSWORD,
  socket: {
    host: envVariables.REDIS_HOST,
    port: envVariables.REDIS_PORT,
  },
});

redisClient.on("error", (err) => {
  const error = CustomError.throwError({
    status: err.status || 500,
    message: "Redis connection error",
    errors: [err.message],
    hints:
      "Please check your Redis server configuration and ensure it is running.",
  });
  throw error;
});

export const connectRedis = async () => {
  if (!redisClient.isReady) {
    console.log("Redis is not connected");
    await redisClient.connect();
    console.log("Connected to Redis successfully");
  } else {
    console.log("Redis is already connected");
  }
};
