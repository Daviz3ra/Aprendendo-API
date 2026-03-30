const axios = require("axios");

async function consomeRota(URL, path, metodo) {
  let response = "";
  switch (metodo) {
    case "get":
      response = await axios.get(URL + path);
      break;
    case "post":
      response = await axios.post(URL + path);
      break;
  }
  return response;
}

async function main() {
  const path = "/validate?nome=davi&idade=17"
  const response = await consomeRota("http://127.0.0.1:3000", path, "get");
  console.log(response.data);
}

main();
