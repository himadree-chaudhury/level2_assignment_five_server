import z from 'zod';

export const userValidationSchema = z.object({
    name: z.string("Please enter your name").min(2, "Name must be at least 2 characters long").max(100, "Name must be at most 100 characters long"),
    email: z.email("Please enter a valid email address"),
    password: z.string("Please enter a password").min(8, "Password must be at least 8 characters long").regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
})

export const userUpdateValidationSchema = z.object({
  name: z
    .string("Please enter your name")
    .max(100, "Name must be at most 100 characters long")
    .optional(),
  phone: z
    .string("Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 characters long")
    .max(15, "Phone number must be at most 15 characters long")
    .optional(),
  picture: z
    .url("Please enter a valid picture URL")
    .optional()
    .or(z.literal("")),
});

export const userVerificationValidationSchema = z.object({
    verificationCode: z.string("Please enter the verification code").length(6, "Verification code must be exactly 6 characters long")
});


export const userSosContactValidationSchema = z.object({
    name: z.string("Please enter a name").min(2, "Name must be at least 2 characters long").max(100, "Name must be at most 100 characters long"),
    phone: z.string("Please enter a valid phone number").min(10, "Phone number must be at least 10 characters long").max(15, "Phone number must be at most 15 characters long"),
});