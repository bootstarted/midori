// @flow
import {compose, send, request, id, logger, use, listen} from '../src';

const app = compose(
  logger,
  use(
    '/id',
    id((id) => {
      return send(`Request: ${id}`);
    }),
  ),
  use('/bar', send('Hi from bar')),
  use(
    '/error',
    request(() => {
      throw new Error('Something went wrong.');
    }),
  ),
  send(404, 'Hi from elsewhere'),
);

listen(app, 8080);
