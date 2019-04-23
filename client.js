'use strict';

const net = require('net');
const process = require('process');
const fs = require('fs');

let headerObj = {};

let CLA = process.argv;

let host = CLA[2];
let method = CLA[3];
let URI = CLA[4];
let body = '';
let length = 0;
let file = 'your.html';

let port = 80;
if (host === 'localhost') {
  port = 8080;
}

if (CLA[2] === '-save') {
  method = 'GET';
  host = CLA[4];
  URI = '/';
  file = CLA[3];
}

if (CLA[5] !== undefined) {
  body = CLA[5];
  length = body.length;
}

if (!CLA[2]) {
  process.stdout.write(
    `\r\n\r\nPlease enter valid arguments for host, method, URI, and body (if POST method is used).  Do not include http:// or https:// in the host or URI.\r\n
    Example of GET:  $ node client.js www.example.com GET /\r\n
    Example of POST: $ node client.js www.example.com POST / hello\r\n
    Valid methods:
    GET - I want a resource including the header and body
    POST - I want to send you data
    HEAD - I just want the response headers\r\n\r\n
    To save a response message body as a file, type the following:\n
    $ node client.js -save example_index.html example.com\n\n\
    This would save the contents of the response message from requesting www.example.com to a file named example_index.html\r\n\r\n`,
  );
  process.exit();
}

let date = new Date();

let request = `${method} ${URI} HTTP/1.1\r\nAccept: text/html\r\nDate: ${date}\r\nHost: ${host}\r\nContent-Length: ${length}\r\nConnection: keep-alive\r\nUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36\r\n\r\n${body}`;

const client = net.createConnection(port, host, function() {
  client.setEncoding('utf-8');
  process.stdout.write('Client connected to: ' + port + '\n');
  process.stdout.write('My Req: ' + request);
  client.write(request);
});

client.on('data', function(data) {
  let getStatus = data.slice(0, data.indexOf('\n'));

  if (getStatus.indexOf('40') !== -1) {
    process.stdout.write('Client Error - please check Host, Method, and URI');
  } else if (getStatus.indexOf('50') !== -1) {
    process.stdout.write('Server Error');
  } else {
    let headerEnd = data.indexOf('\r\n\r\n');
    let getHeader = data.slice(0, headerEnd);
    headerObj[host] = getHeader;

    let responseBody = data.slice(headerEnd, data.length);
    headerObj[URI] = responseBody;

    if (CLA[2] === '-save') {
      fs.writeFile(file, responseBody, function(err) {
        if (err) console.log(err);
      });
    }

    process.stdout.write(data);
  }

});

client.on('end', function() {
  client.end();
  process.exit();
  console.log('Connection ended')
});

client.on('close', function() {
  process.stdout.write('Client closed');
});

client.on('error', function(err) {
  console.error(err);
});
