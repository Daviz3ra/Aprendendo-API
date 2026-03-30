const axios = require("axios");

async function consomeRota(URL, path, metodo, body) {
  let response = "";
  switch (metodo) {
    case "get":
      response = await axios.get(URL + path);
      break;
    case "post":
      response = await axios.post(URL + path, body);
      break;
  }
  return response;
}

async function main() {
  const pessoa = {
    nome: "Huntinho",
    genero: "Fluído",
    idade: 23
  }
  const path = "/test-body"
  const response = await consomeRota("http://127.0.0.1:3000", path, "post", pessoa);
  console.log(response.data);
}

main();
