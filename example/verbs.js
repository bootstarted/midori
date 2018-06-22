// @flow
import {get, post, send, compose, listen} from '../src';

const app = compose(
  get('/foo', send('GET /foo')),
  post('/foo', send('POST /foo')),
  get('/bar', send('GET /bar')),
);

listen(app, 8080);
