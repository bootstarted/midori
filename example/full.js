// @flow
import {
  compose,
  send,
  status,
  request,
  id,
  timing,
  logging,
  use,
  listen,
} from '../src';

const app = compose(
  id(),
  timing(),
  logging(),
  use('/id', request((req) => {
    // $ExpectError
    return send(`Request: ${req.id}`);
  })),
  use('/bar', send('Hi from bar')),
  use('/error', request(() => {
    throw new Error('Something went wrong.');
  })),
  compose(status(404), send('Hi from elsewhere')),
);

listen(app, 8081);
