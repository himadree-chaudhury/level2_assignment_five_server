import z from 'zod';

export const userValidationSchema = z.object({
    name: z.string("Please enter your name").min(2, "Name must be at least 2 characters long").max(100, "Name must be at most 100 characters long"),
    email: z.string("Please enter a valid email").email(),
    password: z.string("Please enter a password").min(6, "Password must be at least 6 characters long").max(100, "Password must be at most 100 characters long")
})