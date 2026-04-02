const fastify = require("fastify")({ logger: true });
const users = [];
let quantityUsers = 0;

fastify.get("/procurar/:id", async (request, reply) => {
  const { id } = request.params;
  return id;
});

fastify.post("/test-body", async (request, reply) => {
  const body = request.body;
  return body;
});

fastify.get("/validate", async (request, reply) => {
  const { nome, idade } = request.query;
  if (idade >= 18) {
    return `O usuário "${nome}" é maior de idade`;
  } else if (idade < 18) {
    return `O usuário "${nome}" é menor de idade`;
  }
  return "Teste sem usuário";
});

fastify.post("/users", (request, reply) => {
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

fastify.get("/retornar-users", (request, reply) => {
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

fastify.get("/id-search/:id", (request, reply) => {
  const { id } = request.params;
  const user = users.find((user) => user.id == id);
  if (!user) {
    return reply.code(404).send({ error: "Usuário não encontrado." });
  }
  return user;
});

fastify.delete("/users/user/:id", (request, reply) => {
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
