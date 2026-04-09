import { z } from "zod";

const cartSchema = z.object({
  clientId: z.string().uuid(),
  products: z.array(z.object({
    name: z.string().min(3),
    price: z.number().gt(0),
    qtd: z.number().min(1).int(),
    categories: z.array(z.string()).min(1)
  }))
})

const cart = {
  clientId: crypto.randomUUID(),
  products: [
    {
      name: "Macbook",
      price: 5000,
      qtd: 1,
      categories: ["Eletronico", "Computador"]
    }
  ]
}

const { success, error } = cartSchema.safeParse(cart)
if (error){
  console.log(error.message)
} else {
  console.log(success)
}