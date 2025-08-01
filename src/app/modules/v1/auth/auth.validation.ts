import z from "zod";

export const authValidationSchema = z.object({
  email: z.string("Please enter a valid email").email("Invalid email format"),
  password: z.string("Please enter a password"),
});
