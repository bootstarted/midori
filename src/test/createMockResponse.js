// @flow
/* eslint-disable no-use-before-define */
import bl from 'bl';
import type {ServerResponse} from 'http';
import type {Socket} from 'net';

type MockedResponse = ServerResponse & {
  socket: Socket,
  statusMessage: ?string,
  body: ?Promise<string>,
  bodyActive: boolean,
  headers: {[string]: string | Array<string>},
};

const createMockResponse = (): MockedResponse => {
  const res = {};

  const ensureBody = () => {
    if (!res.body) {
      res.body = new Promise((resolve, reject) => {
        res.bodyStream = bl((err, result) => {
          err ? reject(err) : resolve(result.toString('utf8'));
        });
      });
    }
  };

  const socket = {
    write(...args) {
      res.bodyActive = true;
      ensureBody();
      return res.bodyStream.write(...args);
    },
    end(...args) {
      res.bodyActive = true;
      ensureBody();
      return res.bodyStream.end(...args);
    },
    on(...args) {
      if (args[0] === 'unpipe') {
        res.bodyActive = true;
      }
      ensureBody();
      res.bodyStream.on(...args);
      return this;
    },
    once(...args) {
      ensureBody();
      res.bodyStream.once(...args);
      return this;
    },
    emit(...args) {
      ensureBody();
      res.bodyStream.emit(...args);
      return this;
    },
    removeListener(...args) {
      ensureBody();
      res.bodyStream.removeListener(...args);
      return this;
    },
    // flowlint-next-line unsafe-getters-setters:off
    get writable() {
      ensureBody();
      return res.bodyStream.writable;
    },
  };

  Object.assign(res, socket, {
    headers: {},
    statusCode: undefined,
    statusMessage: undefined,
    headersSent: false,
    finished: false,
    socket,
    getHeader(name) {
      return this.headers[name.toLowerCase()];
    },
    writeHead: (statusCode, msg, headers) => {
      res.statusCode = statusCode;
      if (typeof msg === 'string') {
        res.statusMessage = msg;
      }
      if (typeof headers === 'undefined' && typeof msg === 'object') {
        Object.assign(res.headers, msg);
      } else if (typeof headers === 'object') {
        Object.assign(res.headers, headers);
      }
      Object.keys(res.headers).forEach((k) => {
        res.headers[k.toLowerCase()] = res.headers[k];
      });
      res.headersSent = true;
    },
    removeHeader: (n) => {
      delete res.headers[n];
      delete res.headers[n.toLowerCase()];
    },
    setHeader: (n, v) => {
      res.headers[n] = v;
      res.headers[n.toLowerCase()] = v;
    },
    write(...args) {
      this.headersSent = true;
      return socket.write.apply(this, args);
    },
    end(...args) {
      this.headersSent = true;
      return socket.end.apply(this, args);
    },
  });

  // flowlint-next-line unclear-type: off
  return (res: any);
};

export default createMockResponse;
