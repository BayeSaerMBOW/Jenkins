const http = require('http');
const port = process.env.PORT || 3000;


const server = http.createServer((req, res) => {
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ message: 'Hello from Node + Docker + Jenkins + Render!', time: new Date().toISOString() }));
});


server.listen(port, () => {
console.log(`Server listening on port ${port}`);
});
module.exports = server;

// End of file