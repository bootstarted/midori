/* eslint no-console: 0 */
import compose from 'lodash/flowRight';
import http from 'http';
import send from '../src/send';
import verbs from '../src/match/verbs';
import connect from '../src/connect';

console.log(verbs);

const createApp = compose(
  verbs.get('/foo', send('GET /foo')),
  verbs.post('/foo', send('POST /foo')),
  verbs.get('/bar', send('GET /bar'))
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
