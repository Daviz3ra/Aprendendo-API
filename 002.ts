import { appendFile } from "node:fs";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email("Email inválido"),
  age: z.number().min(18).max(100),
  apelido: z.string().min(2).optional()
});

const user = {
  email: "valido@email.com",
  age: 28,
  apelido: "Valido"
}

const { success, error } = userSchema.safeParse(user)
if (!success) {
  console.log(error.message)
} else {
  console.log(success)
}