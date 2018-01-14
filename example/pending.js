/* eslint no-console: 0 */
import {send, use, compose, request, pending} from '../src';
import {parse} from 'qs';
import url from 'parseurl';

const waits = [];

// In one browser tab go to /wait
// In another browser tab go to /unwait?name=Fred
const createApp = compose(
  use('/wait', pending((fn) => {
    waits.push(fn);
  })),
  use('/unwait', request((req) => {
    const query = parse(url(req).query);
    const next = send(`Hello ${query.name}`);
    waits.forEach((fn) => {
      fn(next);
    });
    waits.length = 0;
    return send('It is done.');
  })),
);

const app = createApp();

app.listen(8081);
