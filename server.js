'use strict';

const net = require('net');
const elements = require('./elements.js');

let date = new Date();

let response = '';

function craftResponse (status, length, body) {
  let customResponse = `HTTP/1.1 ${status}
Date: ${date}
Content-Type: text/html; charset=utf-8
Content-Length: ${length}

${body}`;

  return customResponse;
}

// this creates a server
const server = net
  .createServer((socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data) => {
      // this is the request
      console.log(data);

      // do work here
      //interpret data being requested for path & craft responses accordingly
      let first20CharactersOfData = data.substring(0, 20);

      if (
        first20CharactersOfData.indexOf('/index.html') !== -1 ||
        first20CharactersOfData.indexOf('GET / HTTP') !== -1
      ) {
        response = craftResponse(elements.index.status, elements.index.length, elements.index.body);
      } else if (first20CharactersOfData.indexOf('/hydrogen.html') !== -1) {
        response = craftResponse(elements.hydrogen.status, elements.hydrogen.length, elements.hydrogen.body);
      } else if (first20CharactersOfData.indexOf('/helium.html') !== -1) {
        response = craftResponse(elements.helium.status, elements.helium.length, elements.helium.body);
      } else if (first20CharactersOfData.indexOf('/css/styles.css') !== -1) {
        response = craftResponse(elements.css.status, elements.css.length, elements.css.body);
      } else {
        response = craftResponse(elements.error.status, elements.error.length, elements.error.body);
      }

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
