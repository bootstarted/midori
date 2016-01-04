/* eslint no-console: 0 */
import http from 'http';
import base from '../src/base';

const server = http.createServer();
const createApp = base({
  locales: [ 'en-US' ],
});

const app = createApp({
  request(req, res) {
    res.statusCode = 200;
    res.end(`Hello ${req.id} [${req.locale}]`);
  },
  error(err) {
    console.log('GOT ERROR', err);
  },
});

server.on('request', app.request);
server.on('error', app.error);

server.listen(8081);
