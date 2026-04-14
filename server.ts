import { z } from "zod";
import Fastify, {
  type FastifyRequest,
  type FastifyReply,
} from "fastify";

let quantityUsers = 0;
const fastify = Fastify();
const users: User[] = [];

const idSchema = z.object({
  id: z.coerce.number().min(1).int(),
});

const usernameSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres").max(20),
  age: z.number().min(12).max(100),
  city: z.string().min(3),
  id: z.number().positive().optional(),
});

const ageSchema = z.object({
  max_age: z.number().min(0).max(100).optional(),
  min_age: z.number().min(0).max(100).optional(),
});

type User = z.infer<typeof usernameSchema>;
type Id = z.infer<typeof idSchema>;
type Age = z.infer<typeof ageSchema>;

fastify.post<{ Body: User }>(
  "/users",
  (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
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
  },
);

fastify.get<{ Querystring: Age }>(
  "/users",
  (request: FastifyRequest<{ Querystring: Age }>, reply: FastifyReply) => {
    const { min_age, max_age } = request.query;
    let usersList = users;
    if (max_age != undefined) {
      usersList = usersList.filter((user) => {
        return user.age <= max_age
      });
    }
    if (min_age != undefined) {
      usersList = usersList.filter((user) => {
        return user.age >= min_age
      });
    }
    return reply.code(200).send(usersList);
  },
);

fastify.get<{ Params: Id }>(
  "/users/:id",
  (request: FastifyRequest<{ Params: Id }>, reply: FastifyReply) => {
    const result = idSchema.safeParse(request.params.id);
    if (!result.success) {
      return reply.code(400).send(result.error.format());
    }
    const id = result.data.id;
    const user = users.find((user) => user.id == id);
    if (!user) {
      return reply.code(404).send({ error: "Usuário não encontrado." });
    }
    return user;
  },
);

fastify.delete<{ Params: Id }>(
  "/users/:id",
  (request: FastifyRequest<{ Params: Id }>, reply: FastifyReply) => {
    const result = idSchema.safeParse(request.params.id);
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
  },
);

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
