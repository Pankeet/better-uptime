import { z } from "zod";

export const User = z.object({
    name : z.string().trim(),
    email : z.email(),
    password : z.string().trim()
})

export const Website = z.object({
    url : z.url(),
    createdAt : z.string().datetime(),
    user_id : z.string()
})