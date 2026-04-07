import { type FastifyRequest, type FastifyReply, type FastifyInstance } from "fastify";
const fastify = require("fastify")({ logger: true }) as FastifyInstance;
const users: User[] = [];

interface Params {
  id: number;
}

interface Query {
  nome?: string;
  idade?: number
  max_age?: number
  min_age?: number
}

interface User {
  nome: string;
  idade: number;
  cidade: string;
  id?: number;
}

let quantityUsers = 0;
fastify.get<{ Params: Params }>("/procurar/:id", async (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
  const { id } = request.params;
  return id;
});

fastify.post("/test-body", async (request: FastifyRequest, reply: FastifyReply) => {
  const body = request.body;
  return body;
});

fastify.post<{ Body: User }>("/users", (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
  try {
    const { nome, idade, cidade } = request.body;
    quantityUsers++;
    const id = quantityUsers;
    const user = { nome, idade, cidade, id };
    users.push(user);
    return { sucess: true, userId: id };
  } catch (err) {
    console.log(err);
    return { sucess: false };
  }
});

fastify.get<{ Querystring: Query }>("/retornar-users", (request: FastifyRequest<{ Querystring: Query }>, reply: FastifyReply) => {
  const { max_age } = request.query;
  const { min_age } = request.query;
  let listaDeUsers = users;
  if (max_age != undefined) {
    listaDeUsers = listaDeUsers.filter((user) => {
      if (user.idade <= max_age) {
        return true;
      } else {
        return false;
      }
    });
  }
  if (min_age != undefined) {
    listaDeUsers = listaDeUsers.filter((user) => {
      if (user.idade >= min_age) {
        return true;
      } else {
        return false;
      }
    });
  }
  return listaDeUsers;
});

fastify.get<{ Params: Params }>("/id-search/:id", (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
  const { id } = request.params;
  const user = users.find((user) => user.id == id);
  if (!user) {
    return reply.code(404).send({ error: "Usuário não encontrado." });
  }
  return user;
});

fastify.delete<{ Params: Params }>("/users/user/:id", (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
  const { id } = request.params;
  const index = users.findIndex((user) => user.id == id);
  if (index === -1) {
    return reply.code(404).send({ error: "Usuário não encontrado." });
  }
  users.splice(index, 1);
  return { message: `Usuário ${id} deletado` };
});

const start = async () => {
  try {
    const host = "192.168.1.34"
    await fastify.listen({ port: 3000, host: host });
    console.log(`Server running on http://${host}:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
