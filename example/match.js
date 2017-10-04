/* eslint no-console: 0 */
import {send, use, compose} from '../src';

const createApp = compose(
  use('/foo', send('Hi from foo')),
  use('/bar', send('Hi from bar')),
  send('Hi from elsewhere'),
);

const app = createApp();

app.listen(8081);
