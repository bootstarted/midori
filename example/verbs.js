/* eslint no-console: 0 */
import {get, post, send, compose} from '../src';

const createApp = compose(
  get('/foo', send('GET /foo')),
  post('/foo', send('POST /foo')),
  get('/bar', send('GET /bar'))
);

const app = createApp();

app.listen(8081);
