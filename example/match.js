/* eslint no-console: 0 */
import compose from 'lodash/flowRight';
import http from 'http';
import send from '../src/send';
import match from '../src/match';
import path from '../src/match/path';
import connect from '../src/connect';

const createApp = compose(
  match(path('/foo'), send('Hi from foo')),
  match(path('/bar'), send('Hi from bar'))
);

const app = createApp({
  request(req, res) {
    if (!res.headersSent) {
      res.statusCode = 404;
      res.end(`Hello from elsewhere.`);
    }
  },
  error(err) {
    console.log('GOT ERROR', err);
  },
});

connect(app, http.createServer()).listen(8081);
