
const net = require('net');
const elements = require('./elements.js');

let date = new Date();
let errorBody = elements.error.body;
let errorLength = elements.error.length;

console.log(errorLength);


let response = `HTTP/1.1 200 OK
Date: ${date}
Content-Type: text/html; charset=utf-8
Content-Length: ${errorLength}

${errorBody}`;

// this creates a server
const server = net.createServer((socket) => {
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    // this is the request
    console.log('i dont know', data);

    // do work here
    

    // send response back here
    socket.end(response);
  });
})
// handle errors on the server
.on('error', (err) => {
  console.log(err);
});

// this starts the server
server.listen(8080, () => {
  console.log('Server is UP');
});