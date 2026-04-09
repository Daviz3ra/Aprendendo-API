import { z } from 'zod'

const orderSchema = z.object({
  size: z.enum(["P", "M", "G"]),
  flavor: z.string().min(3),
  extras: z.array(z.string().min(1)).optional(),
  price: z.number().optional()
}).transform(order => {
const basePrice = {
  "P": 20,
  "M": 30,
  "G": 40,
}[order.size]

const extraPrice = (order.extras?.length || 0) * 5
  
return {
  ...order,
  price: basePrice + extraPrice
}
})

const order = {
  size: "G",
  flavor: "Calabresa",
  extras: ["Bacon"]
}

const { success, data } = orderSchema.safeParse(order)
console.log(data)