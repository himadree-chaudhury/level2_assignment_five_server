import nodemailer from "nodemailer";
import envVariables from "./env";

// Create a test account or replace with real credentials.
export const transporter = nodemailer.createTransport({
  host: envVariables.SMTP_HOST,
  port: envVariables.SMTP_PORT,
  secure: false,
  auth: {
    user: envVariables.SMTP_USER,
    pass: envVariables.SMTP_PASS,
  },
});

