import { z } from 'zod' 

const usernameSchema = z.string().min(3, "Mínimo 3 caracteres").max(20)

const { success, error } = usernameSchema.safeParse("123")

if (!success) {
  console.log(error.message)
}