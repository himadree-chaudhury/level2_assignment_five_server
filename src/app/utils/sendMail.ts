import envVariables from "../config/env";
import { transporter } from "../config/nodeMailer";

export const sendMail = async (mail: { to: string; subject: string; text: string; html: string; }) => {
try {
  await transporter.sendMail({
    from: envVariables.SMTP_USER,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
} catch (error) {
  console.error("Error sending email:", error);
}
};
