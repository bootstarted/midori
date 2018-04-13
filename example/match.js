// @flow
import {listen, send, use, compose} from '../src';

const app = compose(
  use('/foo', send('Hi from foo')),
  use('/bar', send('Hi from bar')),
  send('Hi from elsewhere'),
);

listen(app, 8080);
