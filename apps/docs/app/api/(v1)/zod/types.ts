import { z } from "zod";

export const User = z.object({
    firstname : z.string().trim(),
    lastname: z.string().trim(),
    email : z.email(),
    password : z.string().trim()
})

export const Website = z.object({
    url : z.url(),
    user_id : z.string()
})