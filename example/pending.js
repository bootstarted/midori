// @flow
import {send, use, compose, query, pending, listen} from '../src';

const waits = [];

// In one browser tab go to /wait
// In another browser tab go to /unwait?name=Fred
const app = compose(
  use(
    '/wait',
    pending((fn) => {
      waits.push(fn);
    }),
  ),
  use(
    '/unwait',
    query(({name}) => {
      const next = send(`Hello ${name}`);
      waits.forEach((fn) => {
        fn(next);
      });
      waits.length = 0;
      return send('It is done.');
    }),
  ),
);

listen(app, 8080);
