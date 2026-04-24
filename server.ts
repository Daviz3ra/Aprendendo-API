import { z } from "zod";
import Fastify, { type FastifyRequest, type FastifyReply } from "fastify";

let quantityUsers = 0;
const fastify = Fastify();
const users: User[] = [];

const idSchema = z.object({
  id: z.coerce.number().min(1, "O ID deve ser maior que 0").int(),
});

const usernameSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres").max(20),
  age: z.number().min(12).max(100),
  city: z.string().min(3),
  id: z.number().positive().optional(),
});

const ageSchema = z.object({
  max_age: z.coerce.number().min(0).max(100).optional(),
  min_age: z.coerce.number().min(0).max(100).optional(),
});

type User = z.infer<typeof usernameSchema>;
type Id = z.infer<typeof idSchema>;
type Age = z.infer<typeof ageSchema>;

fastify.post<{ Body: User }>("/users", (request, reply) => {
  try {
    const result = usernameSchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send(result.error.format());
    }
    const { name, age, city } = result.data;
    quantityUsers++;
    const id = quantityUsers;
    const user = { name, age, city, id };
    users.push(user);
    return { sucess: true, userId: id };
  } catch (err) {
    console.log(err);
    return { sucess: false };
  }
});

fastify.get<{ Querystring: Age }>("/users", (request, reply) => {
  const result = ageSchema.safeParse(request.query);
  if (!result.success) {
    return reply.code(400).send(result.error.format());
  }
  const { min_age, max_age } = result.data;
  let usersList = users;
  if (max_age != undefined) {
    usersList = usersList.filter((user) => user.age <= max_age);
  }
  if (min_age != undefined) {
    usersList = usersList.filter((user) => user.age >= min_age);
  }
  return reply.code(200).send(usersList);
});

fastify.get<{ Params: Id }>("/users/:id", (request, reply) => {
  const result = idSchema.safeParse(request.params);
  if (!result.success) {
    return reply.code(400).send(result.error.format());
  }
  const id = result.data.id;
  const user = users.find((user) => user.id == id);
  if (!user) {
    return reply.code(404).send({ error: "Usuário não encontrado." });
  }
  return user;
});

fastify.delete<{ Params: Id }>("/users/:id", (request, reply) => {
  const result = idSchema.safeParse(request.params);
  if (!result.success) {
    return reply.code(400).send(result.error.format());
  }
  const id = result.data.id;
  const index = users.findIndex((user) => user.id == id);
  if (index === -1) {
    return reply.code(404).send({ error: "Usuário não encontrado." });
  }
  users.splice(index, 1);
  return { message: `Usuário ${id} deletado` };
});

const start = async () => {
  try {
    const host = "192.168.1.34";
    await fastify.listen({ port: 3000, host: host });
    console.log(`Server running on http://${host}:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
