import envVariables from "../config/env";
import { transporter } from "../config/nodeMailer";
import { CustomError } from "./error";

export const sendMail = async (mail: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  try {
    await transporter.sendMail({
      from: envVariables.SMTP_USER,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  } catch (error) {
    const err = CustomError.internalServerError({
      message: "Error sending email",
      errors: [error],
      hints: "Please try again later.",
    });
    throw err;
  }
};
