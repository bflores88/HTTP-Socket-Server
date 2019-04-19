'use strict';

const net = require('net');
const process = require('process');

let headerObj = {};

let CLA = process.argv;
let host = CLA[2];
let method = CLA[3];
let URI = CLA[4];
let body = '';
let length = 0;

let port = 80;
if (host === 'localhost') {
  port = 8080;
}

if (CLA[5] !== undefined) {
  body = CLA[5];
  length = body.length;
}

if (!CLA[2]) {
  process.stdout.write(
    `\r\n\r\nPlease enter valid arguments for host, method, URI, and body (if POST method is used).\r\n
    Example:  $ node client.js www.example.com GET /\r\n
    Valid methods:
    GET - I want a resource including the header and body
    POST - I want to send you data
    HEAD - I just want the response headers\r\n\r\n`,
  );
  process.exit();
}

let date = new Date();

let request = `${method} ${URI} HTTP/1.1\r\nAccept: text/html\r\nDate: ${date}\r\nHost: ${host}\r\nContent-Length: ${length}\r\nConnection: keep-alive\r\nUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36\r\n\r\n${body}`;

const client = net.createConnection(port, host, function() {
  client.setEncoding('utf-8');
  process.stdout.write('Client connected to: ' + port);
  process.stdout.write('My Req: ' + request);
  client.write(request);
});

client.on('data', function(data) {
  if (data.indexOf('HTTP/1.1 40' !== -1)) {
    process.stdout.write('what the hell\r\n');
  } else {
    let headerEnd = data.indexOf('\r\n\r\n');
    let getHeader = data.slice(0, headerEnd);
    headerObj[host] = getHeader;

    process.stdout.write(data);
  }

  if (data.toString().endsWith('exit')) {
    client.destroy();
  }
});

client.on('close', function() {
  process.stdout.write('Client closed');
});

client.on('error', function(err) {
  console.error(err);
});
