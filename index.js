const axios = require('axios')

async function getData(number) {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${number}`)
    console.log(response.data)
    console.log(response.status)
}

async function getCompleted(inicio, fim) {
    for (let i = inicio; i <= fim; i++) {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${i}`)  
        if (response.data.completed === true) {
            console.log(`${response.data.id} - ${response.data.title}`)
        }
    }
}

getCompleted(4, 12)