
const net = require('net');
const elements = require('./elements.js');

let date = new Date();

let response = '';

let errorResponse = `HTTP/1.1 404 Page Not Found
Date: ${date}
Content-Type: text/html; charset=utf-8
Content-Length: ${elements.error.length}

${elements.error.body}`;

let htmlResponse = `HTTP/1.1 200 OK
Date: ${date}
Content-Type: text/html; charset=utf-8
Content-Length: ${elements.index.length}

${elements.index.body}`;

let hydrogenResponse = `HTTP/1.1 200 OK
Date: ${date}
Content-Type: text/html; charset=utf-8
Content-Length: ${elements.hydrogen.length}

${elements.hydrogen.body}`;

let heliumResponse = `HTTP/1.1 200 OK
Date: ${date}
Content-Type: text/html; charset=utf-8
Content-Length: ${elements.helium.length}

${elements.helium.body}`;

let cssResponse = `HTTP/1.1 200 OK
Date: ${date}
Content-Type: text/html; charset=utf-8
Content-Length: ${elements.css.length}

${elements.css.body}`;

// this creates a server
const server = net.createServer((socket) => {
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    // this is the request
    console.log(data);

    // do work here
    //interpret data being requested for path & craft responses accordingly
    let first20CharactersOfData = data.substring(0, 20);
  
    if(first20CharactersOfData.indexOf('/index.html') !== -1 || first20CharactersOfData.indexOf('GET / HTTP') !== -1){
      response = htmlResponse;
    } else if(first20CharactersOfData.indexOf('/hydrogen.html') !== -1){
      response = hydrogenResponse;
    } else if(first20CharactersOfData.indexOf('/helium.html') !== -1){
      response = heliumResponse;
    } else if(first20CharactersOfData.indexOf('/css/styles.css') !== -1){
      response = cssResponse;
    } else { response = errorResponse;}


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