import { z } from "zod";
import {
  type FastifyRequest,
  type FastifyReply,
  type FastifyInstance,
} from "fastify";
const fastify = require("fastify")({ logger: true }) as FastifyInstance;
const users: User[] = [];

interface Params {
  id: number;
}

interface Query {
  max_age?: number;
  min_age?: number;
}

interface User {
  name: string;
  age: number;
  city: string;
  id?: number;
}

const usernameSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres").max(20),
  age: z.number().min(12).max(100),
  city: z.string().min(3),
  id: z.number().positive().optional(),
});

let quantityUsers = 0;

fastify.post<{ Body: User }>(
  "/users",
  (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
    try {
      const { name, age, city } = request.body;
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

fastify.get<{ Querystring: Query }>(
  "/return-users",
  (request: FastifyRequest<{ Querystring: Query }>, reply: FastifyReply) => {
    const { max_age } = request.query;
    const { min_age } = request.query;
    let userList = users;
    if (max_age != undefined) {
      userList = userList.filter((user) => {
        if (user.age <= max_age) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (min_age != undefined) {
      userList = userList.filter((user) => {
        if (user.age >= min_age) {
          return true;
        } else {
          return false;
        }
      });
    }
    return userList;
  },
);

fastify.get<{ Params: Params }>(
  "/id-search/:id",
  (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
    const { id } = request.params;
    const user = users.find((user) => user.id == id);
    if (!user) {
      return reply.code(404).send({ error: "Usuário não encontrado." });
    }
    return user;
  },
);

fastify.delete<{ Params: Params }>(
  "/users/:id",
  (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
    const { id } = request.params;
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
