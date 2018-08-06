// @flow
import {getStatusText} from 'http-status-codes';
import httpHeaders from 'http-headers';
import indexOf from 'buffer-indexof';

import type {App} from './types';
import type {IncomingMessage, ServerResponse} from 'http';
import type {Socket} from 'net';
type RequestHandler = (req: ServerResponse) => App | Promise<App>;
type Headers = {
  [string]: Array<string> | string,
};

const endOfHeaders = Buffer.from('\r\n\r\n');

class ProxyUpgradeResponse {
  headers: Headers = {};
  statusCode: number = 200;
  statusMessage: ?string = null;
  headersSent: boolean = false;
  socket: Socket;
  finished: boolean = false;
  constructor(socket: Socket) {
    this.socket = socket;
    const oldWrite = socket.write;
    const oldEnd = socket.end;

    let headBuffer = null;

    const restore = () => {
      // $ExpectError
      socket.write = oldWrite;
      // $ExpectError
      socket.end = oldEnd;
    };

    const wrieHeadBuffer = (data) => {
      headBuffer = headBuffer ? Buffer.concat([headBuffer, data]) : data;
      const index = indexOf(headBuffer, endOfHeaders);
      if (index !== -1) {
        headBuffer.slice(0, index);
        Object.assign(this, httpHeaders(headBuffer));
        this.headersSent = true;
        restore();
      }
    };

    const handleData = (data, encoding) => {
      // $ExpectError
      if (socket.ended || !socket.writable) {
        restore();
        return;
      }
      if (this.headersSent || !data) {
        return;
      }
      if (!Buffer.isBuffer(data)) {
        wrieHeadBuffer(
          Buffer.from(
            data,
            typeof encoding === 'string' ? encoding : undefined,
          ),
        );
      } else {
        wrieHeadBuffer(data);
      }
    };

    // $ExpectError
    socket.write = (data, encoding, cb) => {
      handleData(data, encoding);
      return oldWrite.call(socket, data, encoding, cb);
    };

    // $ExpectError
    socket.end = (data, encoding, cb) => {
      handleData(data, encoding);
      return oldEnd.call(socket, data, encoding, cb);
    };
  }
  getHeader(name) {
    return this.headers[name.toLowerCase()];
  }
  writeHead(statusCode: number = this.statusCode, msg?, headers?) {
    if (this.headersSent) {
      return;
    }
    this.statusCode = statusCode;
    if (typeof msg === 'string') {
      this.statusMessage = msg;
    } else {
      try {
        this.statusMessage = getStatusText(this.statusCode);
      } catch (err) {
        this.statusMessage = '';
      }
    }
    let newHeaders = {};
    if (typeof headers === 'undefined' && typeof msg === 'object') {
      newHeaders = msg;
    } else if (typeof headers === 'object') {
      newHeaders = headers;
    }
    Object.keys(newHeaders).forEach((k) => {
      this.headers[k.toLowerCase()] = newHeaders[k];
    });
    this.headersSent = true;
    this.socket.write(`HTTP/1.1 ${this.statusCode}`);
    if (
      typeof this.statusMessage === 'string' &&
      this.statusMessage.length > 0
    ) {
      this.socket.write(` ${this.statusMessage}\n`);
    } else {
      this.socket.write('\n');
    }
    Object.keys(this.headers).forEach((header) => {
      const value = this.headers[header];
      if (typeof value === 'string') {
        this.socket.write(`${header}: ${value}\n`);
      } else if (Array.isArray(value)) {
        value.forEach((value) => {
          this.socket.write(`${header}: ${value}\n`);
        });
      }
    });
    this.socket.write('\n');
  }
  removeHeader(n) {
    delete this.headers[n.toLowerCase()];
  }
  setHeader(n, v) {
    this.headers[n.toLowerCase()] = v;
  }
  removeListener(...args) {
    this.socket.removeListener(...args);
  }
  on(...args) {
    this.socket.on(...args);
    return this;
  }
  once(...args) {
    this.socket.once(...args);
    return this;
  }
  emit(...args) {
    this.socket.emit(...args);
    return this;
  }
  write(...args) {
    if (!this.headersSent) {
      this.writeHead();
    }
    return this.socket.write(...args);
  }
  end(...args) {
    this.finished = true;
    if (!this.headersSent) {
      this.writeHead();
    }
    return this.socket.end(...args);
  }
}

const proxyResponseCache: WeakMap<
  IncomingMessage,
  ProxyUpgradeResponse,
> = new WeakMap();

export const getUpgradeResponse = (req: IncomingMessage) => {
  return proxyResponseCache.get(req);
};

export const installUpgradeResponse = (
  req: IncomingMessage,
  socket: Socket,
): ProxyUpgradeResponse => {
  let proxyResponse = proxyResponseCache.get(req);
  if (proxyResponse === undefined) {
    proxyResponse = new ProxyUpgradeResponse(socket);
    proxyResponseCache.set(req, proxyResponse);
  }
  return proxyResponse;
};

/**
 * Main thing.
 * @param {Function} handler Request handler. Must return another app.
 * @returns {App} App instance.
 */
const response = (handler: RequestHandler): App => (app) => {
  return {
    ...app,
    request: async (req, res) => {
      try {
        const nextApp = await handler(res);
        return await nextApp(app).request(req, res);
      } catch (err) {
        return await app.requestError(err, req, res);
      }
    },
    upgrade: async (req, socket, head) => {
      try {
        const proxyResponse = installUpgradeResponse(req, socket);
        // flowlint-next-line unclear-type: off
        const nextApp = await handler((proxyResponse: any));
        return await nextApp(app).upgrade(req, socket, head);
      } catch (err) {
        return await app.upgradeError(err, req, socket, head);
      }
    },
  };
};

response._selector = () => null;

export default response;
