// @flow
import request from './request';
import pure from './pure';

import type {IncomingMessage, ServerResponse} from 'http';
import {Readable} from 'stream';

type Body = string |
  Buffer |
  (req: IncomingMessage, res: ServerResponse) => Body |
  Promise<Body> |
  Readable;

/**
 * Send content to the client.
 * @param {String|Buffer|Function|Promise|Readable} body Data to send.
 * @returns {Function} App creator.
 */
const send = (body: Body) => {
  if (typeof body === 'string' || Buffer.isBuffer(body)) {
    return request((req, res) => {
      res.setHeader('Content-Length', body.length.toString());
      res.end(body);
      return pure(null);
    });
  } else if (typeof body === 'function') {
    const b:((req: IncomingMessage, res: ServerResponse) => Body) = (body: any);
    return request((req, res) => send(b(req, res)));
  } else if (body && typeof body.then === 'function') {
    const result = body.then((result) => send(result));
    return request(() => result);
  } else if (body && typeof body.pipe === 'function') {
    const b:Readable = (body: any);
    return request((req, res) => {
      b.pipe(res);
      return pure(null);
    });
  }
  throw new TypeError('Invalid value given to `send`.');
};

export default send;
