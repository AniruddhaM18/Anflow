import { email, z } from "zod";

export const SignupSchema = z.object({
    username: z.string().min(3).max(12),
    email: z.email()
})

export const SigninSchema = z.object({
    email: z.email()
})

export const CredentialSchema = z.object({
    title: z.string(),
    platform : z.string(),
    data: z.object({
        apikey : z.string().optional(),
        accessToken: z.string().optional(),
        privateKey : z.string().optional()
    })
})