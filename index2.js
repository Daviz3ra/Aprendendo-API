const axios = require("axios");

async function imprimePosts(infoUsuario, post) {
    console.log(`Nome: ${infoUsuario.name} (${infoUsuario.id})\nPost ${post.id}: ${post.title}\n\n---\n`)
}

async function buscaInfoUsuario(idUsuario) {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${idUsuario}` );
    const usuario = response.data
    return usuario
}

async function verificaPosts() {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts` );
    const qnt_posts = response.data.length
    for (let i = 0; i < qnt_posts; i++){
        const post = response.data[i]
        if(post.userId % 2 === 0) {
            const infoUsuario = await buscaInfoUsuario(post.userId)
            await imprimePosts(infoUsuario, post)
        }
    }
}

verificaPosts()