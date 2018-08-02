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
  // $ExpectError
  if (socket.ended || !socket.writable) {
    console.error('Error occured after response already delivered.');
    console.error('This probably indicates a problem elsewhere.');
    console.error(err);
    return;
  }
  socket.end(
    'HTTP/1.1 500 Internal Server Error\r\n' + 'Connection: Close\r\n' + '\r\n',
  );
};

export default upgradeErrorHandler;
