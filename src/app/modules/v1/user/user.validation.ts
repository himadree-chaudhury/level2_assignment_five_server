import z from 'zod';

export const userValidationSchema = z.object({
    name: z.string("Please enter your name").min(2, "Name must be at least 2 characters long").max(100, "Name must be at most 100 characters long"),
    email: z.email("Please enter a valid email address"),
    password: z.string("Please enter a password").min(6, "Password must be at least 6 characters long").max(100, "Password must be at most 100 characters long")
})

export const userUpdateValidationSchema = z.object({
    name: z.string("Please enter your name").min(2, "Name must be at least 2 characters long").max(100, "Name must be at most 100 characters long").optional(),
    phone: z.string("Please enter a valid phone number").optional(),
    picture: z.url("Please enter a valid picture URL").optional(),
})

export const userVerificationValidationSchema = z.object({
    verificationCode: z.string("Please enter the verification code").length(6, "Verification code must be exactly 6 characters long")
});