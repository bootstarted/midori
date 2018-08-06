// @flow
import bl from 'bl';
import type {Readable} from 'stream';

type Options = {
  url?: string,
  method?: string,
  body?: string | Buffer | Readable,
  headers?: {[string]: string},
  offline?: boolean,
  encrypted?: boolean,
};

const createMockRequest = (options: Options) => {
  let reqBodyStream: Readable;
  const ensureReqBody = () => {
    if (!reqBodyStream) {
      if (typeof options.body === 'string' || Buffer.isBuffer(options.body)) {
        reqBodyStream = bl(options.body);
      } else if (options.body && typeof options.body.read === 'function') {
        // flowlint-next-line unclear-type: off
        reqBodyStream = (options.body: any);
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
  const req = {
    method: typeof options.method === 'string' ? options.method : 'GET',
    url: typeof options.url === 'string' ? options.url : '/',
    headers: rawHeaders,
    // flowlint-next-line unclear-type: off
    read: (...args: any) => {
      ensureReqBody();
      return reqBodyStream.read(...args);
    },
    // flowlint-next-line unclear-type: off
    pipe: (...args: any) => {
      ensureReqBody();
      return reqBodyStream.pipe(...args);
    },
    // flowlint-next-line unclear-type: off
    on: (...args: any) => {
      ensureReqBody();
      reqBodyStream.on(...args);
      return req;
    },
    // flowlint-next-line unclear-type: off
    once: (...args: any) => {
      ensureReqBody();
      reqBodyStream.on(...args);
      return req;
    },
    // flowlint-next-line unclear-type: off
    removeListener: (...args: any) => {
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
  return req;
};

export default createMockRequest;
