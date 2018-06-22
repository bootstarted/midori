/* @flow */
import bl from 'bl';

import type {App} from '../types';
import type {IncomingMessage, ServerResponse} from 'http';
import type {Readable} from 'stream';
import {getUpgradeResponse} from '../response';

type Options = {
  method: string,
  headers: {[string]: string},
  body: string | Buffer | Readable,
  encrypted: boolean,
  offline: boolean,
  onError: (err: Error) => void,
  onNext: () => void,
  mapRequest: (req: IncomingMessage) => IncomingMessage,
};

type MockedResponse = ServerResponse & {
  body: string,
  error: ?Error,
  result: ?mixed,
};

// eslint-disable-next-line
const fetch = async (
  App: App,
  path: string = '/',
  _options: ?Options,
): Promise<MockedResponse> => {
  let globalError = null;
  const options = _options || {};
  const stub: App = {
    request: () => {
      options.onNext && options.onNext();
    },
    requestError: (err: Error) => {
      globalError = err;
      options.onError && options.onError(err);
    },
    upgradeError: (err: Error) => {
      globalError = err;
      options.onError && options.onError(err);
    },
    // TODO: Do we need to check for errors here?
    error: /* istanbul ignore next */ () => {},
    close: () => {},
    upgrade: () => {
      options.onNext && options.onNext();
    },
    listening: () => {},
  };
  const app = typeof App === 'function' ? App(stub) : App;

  let reqBodyStream: Readable;
  const ensureReqBody = () => {
    if (!reqBodyStream) {
      if (typeof options.body === 'string' || Buffer.isBuffer(options.body)) {
        reqBodyStream = bl(options.body);
      } else if (options.body && typeof options.body.read === 'function') {
        // FIXME: Flow dislikes duck typing.
        // $ExpectError
        reqBodyStream = options.body;
      } else if (typeof options.body === 'undefined') {
        reqBodyStream = bl('');
      } else {
        throw new TypeError('Invalid request body given.');
      }
    }
  };
  const rawHeaders = options.headers || {};
  Object.keys(rawHeaders).forEach((k) => {
    rawHeaders[k.toLowerCase()] = rawHeaders[k];
  });
  let req = {
    method: options.method || 'GET',
    url: path,
    headers: rawHeaders,
    read: (...args) => {
      ensureReqBody();
      return reqBodyStream.read(...args);
    },
    pipe: (...args) => {
      ensureReqBody();
      return reqBodyStream.pipe(...args);
    },
    on: (...args) => {
      ensureReqBody();
      reqBodyStream.on(...args);
      return req;
    },
    once: (...args) => {
      ensureReqBody();
      reqBodyStream.on(...args);
      return req;
    },
    removeListener: (...args) => {
      ensureReqBody();
      reqBodyStream.removeListener(...args);
      return req;
    },
    connection: {
      encrypted: options.encrypted,
    },
    // TODO: Consider stubbing more of this?
    socket: {
      _handle: options.offline === true ? null : 1,
    },
    // flowlint-next-line unsafe-getters-setters:off
    get body() {
      ensureReqBody();
      return reqBodyStream;
    },
  };
  if (options && options.mapRequest) {
    // $ExpectError
    req = options.mapRequest((req: any));
  }

  let body;
  let bodyStream;
  let bodyActive = false;

  const ensureBody = () => {
    if (!body) {
      body = new Promise((resolve, reject) => {
        bodyStream = bl((err, result) => {
          err ? reject(err) : resolve(result.toString('utf8'));
        });
      });
    }
  };

  const socket = {
    write(...args) {
      bodyActive = true;
      ensureBody();
      return bodyStream.write(...args);
    },
    end(...args) {
      bodyActive = true;
      ensureBody();
      return bodyStream.end(...args);
    },
    on(...args) {
      if (args[0] === 'unpipe') {
        bodyActive = true;
      }
      ensureBody();
      bodyStream.on(...args);
      return this;
    },
    once(...args) {
      ensureBody();
      bodyStream.once(...args);
      return this;
    },
    emit(...args) {
      ensureBody();
      bodyStream.emit(...args);
      return this;
    },
    removeListener(...args) {
      ensureBody();
      bodyStream.removeListener(...args);
      return this;
    },
    // flowlint-next-line unsafe-getters-setters:off
    get writable() {
      ensureBody();
      return bodyStream.writable;
    },
  };

  const res = {
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
    ...socket,
    write(...args) {
      this.headersSent = true;
      return socket.write.apply(this, args);
    },
    end(...args) {
      this.headersSent = true;
      return socket.end.apply(this, args);
    },
  };

  // TODO: FIXME: Any better way of casting through `any`?
  // flowlint-next-line unclear-type: off
  const realRes: MockedResponse = (res: any);
  let result;
  if (
    req.headers.connection &&
    req.headers.connection.toLowerCase() === 'upgrade'
  ) {
    // flowlint-next-line unclear-type: off
    result = await app.upgrade((req: any), (socket: any), new Buffer(''));
  } else {
    // flowlint-next-line unclear-type: off
    result = await app.request((req: any), realRes);
  }

  // flowlint-next-line unclear-type: off
  const mock = getUpgradeResponse((req: any));
  if (mock) {
    res.headers = mock.headers;
    res.statusCode = mock.statusCode;
    res.statusMessage = mock.statusMessage;
    res.headersSent = mock.headersSent;
    res.finished = mock.finished;
  }
  if (globalError && !options.onError) {
    return Promise.reject(globalError);
  }
  realRes.error = globalError;
  realRes.result = result;
  if (bodyActive) {
    // FIXME: flow being stupid again
    // $ExpectError
    realRes.body = await body;
    return realRes;
  }
  return realRes;
};

export default fetch;
