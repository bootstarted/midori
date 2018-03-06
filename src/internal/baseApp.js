// @flow
import errorHandler from './errorHandler';
import handleResult from './handleResult';

import type {IncomingMessage, ServerResponse} from 'http';
import type {Socket} from 'net';

const baseApp = {
  request(req: IncomingMessage, res: ServerResponse) {
    if (!res.finished) {
      if (!res.headersSent) {
        res.statusCode = 404;
      }
      res.end();
    }
  },
  upgrade(req: IncomingMessage, socket: Socket, _head: *) {
    // There isn't really a "catch-all" like `res.finished` for the `upgrade`
    // event. So if we're the only listener then we know we can close the
    // connection. Otherwise we just pray whomever else has attached to the
    // event knows what they're doing.
    if (
      typeof this.listenerCount !== 'function' ||
      this.listenerCount('upgrade') === 1
    ) {
      socket.end('HTTP/1.1 501 Not Implemented\r\n' +
        'Connection: Close\r\n' +
        '\r\n'
      );
    }
  },
  listening() {

  },
  close() {

  },
  error(err: Error, req: IncomingMessage, res: ServerResponse) {
    return handleResult(errorHandler(err, req, res), this, req, res);
  },
};

export default baseApp;
