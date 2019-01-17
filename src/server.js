/**
 * 
 * Pure Node Server
 * 
 */

// Node Dependencies
import http from 'http';
import url from 'url';
import { parse } from 'querystring';

// External Dependencies
// import express from 'express';

// define a handler to listen to requests to the server
function handler(req, res) {
  // store the parsed url object
  const parsedURL = url.parse(req.url, true);

  //print the requeted url to the console
  console.log(`req path: ${parsedURL.pathname.trim()}`);

  // define the root handler
  if (parsedURL.pathname.trim() === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hello I am a web server');
    res.end();
  } else if (parsedURL.pathname.trim() === '/device' && req.method === 'POST') {
    collectRequestData(req, (result) => {
      console.log(result);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Request recived.');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end();
  }
}

function collectRequestData(req, cb) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if (req.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      cb(parse(body));
    });
  } else {
    cb(null);
  }
}

// create an http server
const server = http.createServer(handler);

// listen on the specified port
server.listen(3000, (err) => {
  console.log(`The server is listening at localhost on ${server.address().port}`);
});
