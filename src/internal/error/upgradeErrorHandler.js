// @flow
/* eslint-disable no-console */
/* global console process */

import type {IncomingMessage} from 'http';
import type {Socket} from 'net';

const upgradeErrorHandler = (
  err: Error,
  req: IncomingMessage,
  socket: Socket,
  _head: Buffer,
) => {
  socket.end(
    'HTTP/1.1 500 Internal Server Error\r\n' + 'Connection: Close\r\n' + '\r\n',
  );
};

export default upgradeErrorHandler;
