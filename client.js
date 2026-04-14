import axios from "axios";
const enderecoServer = "http://192.168.1.34:3000";

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

async function createUser() {
  const pessoa = {
    name: "Davi",
    age: 17,
    city: "Videira",
  };
  const pessoa1 = {
    name: "Lucas",
    age: 25,
    city: "São Paulo",
  };
  const pessoa2 = {
    name: "Mariana",
    age: 30,
    city: "Curitiba",
  };
  const pessoa3 = {
    name: "João",
    age: 18,
    city: "Florianópolis",
  };
  const pessoa4 = {
    name: "Ana Clara",
    age: 22,
    city: "Rio de Janeiro",
  };
  const pessoa5 = {
    name: "Pedro",
    age: 40,
    city: "Porto Alegre",
  };
  const path = "/users";
  const response = await consomeRota(enderecoServer, path, "post", pessoa);
  console.log(response.data);
}

async function viewList() {
  const response = await consomeRota(enderecoServer, "/users", "get");
  console.log(response.data);
}

async function viewUserById() {
  const response = await consomeRota(enderecoServer, "/users/3", "get");
  console.log(response.data);
}

async function deleteUser() {
  const response = await consomeRota(enderecoServer, "/users/2", "delete");
  console.log(response.data);
}

createUser();
// viewList();
viewUserById();
// deleteUser();
