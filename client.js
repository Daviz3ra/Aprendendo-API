const axios = require("axios");
const enderecoServer = "http://127.0.0.1:3000";

async function consomeRota(URL, path, metodo, body) {
  let response = "";
  switch (metodo) {
    case "get":
      response = await axios.get(URL + path);
      break;
    case "post":
      response = await axios.post(URL + path, body);
      break;
    case "delete":
      response = await axios.delete(URL + path);
  }
  return response;
}

async function main() {
  const pessoa = {
    nome: "Manfe",
    idade: 35,
    cidade: "Videira",
  };
  const path = "/users";
  const response = await consomeRota(enderecoServer, path, "post", pessoa);
  console.log(response.data);
}

async function viewList() {
  const response = await consomeRota(enderecoServer, "/retornar-users", "get");
  console.log(response.data);
}

async function viewUserById() {
  const response = await consomeRota(enderecoServer, "/id-search/3", "get");
  console.log(response.data);
}

async function deleteUser() {
  const response = await consomeRota(enderecoServer, "/users/user/1", "delete");
  console.log(response.data);
}

// main();
// viewList();
// viewUserById();
// deleteUser();
