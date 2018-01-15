/* @flow */
import bl from 'bl';

import type {AppCreator, App} from '../types';
import type {IncomingMessage, ServerResponse} from 'http';

type Options = {
  method: string,
  headers: {[string]: string},
  body: string | Buffer,
  onError: (err: Error, req: IncomingMessage, res: ServerResponse) => void,
  onNext: (req: IncomingMessage, res: ServerResponse) => void,
};

type MockedResponse = ServerResponse & {
  body: string,
  error: ?Error,
};

const fetch = (
  appCreator: AppCreator,
  path: string = '/',
  _options: ?Options
): Promise<MockedResponse> => {
  let globalError = null;
  const options = _options || {};
  const stub: App = {
    request: (req: IncomingMessage, res: ServerResponse) => {
      options.onNext && options.onNext(req, res);
    },
    error: (err: Error, req: IncomingMessage, res: ServerResponse) => {
      globalError = err;
      options.onError && options.onError(err, req, res);
    },
    close: () => {},
    upgrade: () => {},
    listening: () => {},
    stack: [],
    matches: () => false,
  };
  const app = typeof appCreator === 'function' ? appCreator(stub) : appCreator;

  let reqBodyStream;
  const ensureReqBody = () => {
    if (!reqBodyStream) {
      reqBodyStream = bl(options.body || '');
    }
  };
  const req = {
    method: 'GET',
    url: path,
    headers: {},
    getHeader: (name) => req.headers[name.toLowerCase()],
    read: (...args) => {
      ensureReqBody();
      return reqBodyStream.read(...args);
    },
    pipe: (...args) => {
      ensureReqBody();
      return reqBodyStream.pipe(...args);
    },
    ...options,
  };

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

  const res = {
    headers: {},
    statusCode: 200,
    statusMessage: '',
    headersSent: false,
    finished: false,
    getHeader: (name) => res.headers[name.toLowerCase()],
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
      res.headersSent = true;
    },
    removeHeader: (n) => {
      delete res.headers[n];
    },
    setHeader: (n, v) => {
      res.headers[n.toLowerCase()] = v;
    },
    write: (...args) => {
      res.headersSent = true;
      bodyActive = true;
      ensureBody();
      return bodyStream.write(...args);
    },
    end: (...args) => {
      res.headersSent = true;
      bodyActive = true;
      ensureBody();
      return bodyStream.end(...args);
    },
    on: (...args) => {
      ensureBody();
      bodyStream.on(...args);
      return res;
    },
    once: (...args) => {
      ensureBody();
      bodyStream.on(...args);
      return res;
    },
    emit: (...args) => {
      ensureBody();
      bodyStream.emit(...args);
      return res;
    },
    removeListener: (...args) => {
      ensureBody();
      bodyStream.removeListener(...args);
      return res;
    },
  };
  const realRes: MockedResponse = (res: any);
  const result = app.request((req: any), realRes);
  return Promise.resolve(result).then(() => {
    if (globalError && !options.onError) {
      return Promise.reject(globalError);
    }
    realRes.error = globalError;
    if (bodyActive) {
      return body.then((body) => {
        realRes.body = body;
        return realRes;
      });
    }
    return realRes;
  });
};

export default fetch;
