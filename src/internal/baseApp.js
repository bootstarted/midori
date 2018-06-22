// @flow
import requestErrorHandler from './error/requestErrorHandler';
import upgradeErrorHandler from './error/upgradeErrorHandler';
import genericErrorHandler from './error/genericErrorHandler';

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
      socket.end(
        'HTTP/1.1 404 Not Found\r\n' + 'Connection: Close\r\n' + '\r\n',
      );
    }
  },
  listening() {},
  close() {},
  error: genericErrorHandler,
  upgradeError: upgradeErrorHandler,
  requestError: requestErrorHandler,
};

export default baseApp;
