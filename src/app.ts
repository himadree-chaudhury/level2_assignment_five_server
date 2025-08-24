import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import httpStatus from "http-status-codes";
import morgan from "morgan";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { traceIdMiddleware } from "./app/middlewares/traceIdHandler";
import { router } from "./app/routes";
const app = express();
app.use(express.json());

app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ride-booking-frontend-cabsy.vercel.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(
//   expressSession({
//     secret: envVariables.EXPRESS_SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set to true if using HTTPS
//   })
// );
app.use(traceIdMiddleware);

app.use("/api/v1", router);

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Welcome to the Ride Booking API!");
});

app.use(globalErrorHandler);

app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: false,
    message: "Route Not Found",
  });
});

export default app;
