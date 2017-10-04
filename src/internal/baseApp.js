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
      if (!res.headerSent) {
        res.statusCode = 404;
      }
      res.end();
    }
  },
  upgrade(req, socket, _head) {
    socket.write('HTTP/1.1 501 Not Implemented\r\n' +
               'Connection: Close\r\n' +
               '\r\n');
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
