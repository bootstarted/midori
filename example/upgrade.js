// @flow
import {upgrade, halt, compose, listen, send, use, logger} from '../src';

const app = compose(
  logger,
  use(
    '/foo',
    upgrade(({socket}) => {
      socket.end('HTTP/1.1 543 Potato\r\n' + 'Connection: Close\r\n' + '\r\n');
      return halt;
    }),
  ),
  use('/bar', upgrade(() => send(543, {Connection: 'close'}, ''))),
);

listen(app, 8080);
