const fastify = require("fastify")({ logger: true });

fastify.get("/procurar/:id", async (request, reply) => {
  const { id } = request.params;
  return id;
});

fastify.post("/test-body", async (request, reply) => {
  const { body } = request.body;
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

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
