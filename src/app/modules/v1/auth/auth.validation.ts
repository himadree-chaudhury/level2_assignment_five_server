import z from "zod";

export const authValidationSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string("Please enter a password"),
});
