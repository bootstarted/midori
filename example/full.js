/* eslint no-console: 0 */
import {
  compose,
  send,
  status,
  request,
  id,
  timing,
  logging,
  use,
} from '../src';

const createApp = compose(
  id(),
  timing(),
  logging(),
  use('/id', request((req) => {
    return send(`Request: ${req.id}`);
  })),
  use('/bar', send('Hi from bar')),
  use('/error', request(() => {
    throw new Error('Something went wrong.');
  })),
  compose(status(404), send('Hi from elsewhere')),
);

const app = createApp();

app.listen(8081);
