import http from 'http';
import errorHandler from './errorHandler';
import connect from '../connect';
import handleResult from './handleResult';

const baseApp = {
  stack: [{type: 'ROOT'}],
  listen(...args) {
    return connect(this, http.createServer()).listen(...args);
  },
  request(req, res) {
    if (!res.finished) {
      if (!res.headersSent) {
        res.statusCode = 404;
      }
      res.end();
    }
  },
  upgrade(req, socket, _head) {
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
  error(err, req, res) {
    return handleResult(errorHandler(err, req, res), this, req, res);
  },
};

export default baseApp;
