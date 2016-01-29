/* eslint no-console: 0 */
import http from 'http';
import base from '../src/base';
import connect from '../src/adapter/http';

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

connect(app, http.createServer()).listen(8081);
