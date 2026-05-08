import { z } from "zod";

export const User = z.object({
    name : z.string().trim(),
    email : z.email(),
    password : z.string().trim()
})