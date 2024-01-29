const http = require ('http')
const port = 5020
const server = http.createServer((req, res) => {
    res.send('Que onda alumnos')
})
server.listen(port, ()=>{
    console.log('Servidor Trabajando')
} )