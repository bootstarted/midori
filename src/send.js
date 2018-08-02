// @flow
import response from './response';
import halt from './halt';
import {Readable} from 'stream';

import type {ServerResponse} from 'http';
import type {App} from './types';

type Body = string | Buffer | Readable;

type Headers = {[string]: string | Array<string>};

const handleHead = (
  res: ServerResponse,
  status: ?number,
  headers: ?Headers,
) => {
  if (typeof status === 'number' || headers) {
    // $ExpectError
    res.writeHead(status, headers);
  }
};

const sendBinary = (
  status: ?number,
  headers: ?Headers,
  body: string | Buffer,
) => {
  return response((res) => {
    // 'utf8' here is only applicable if the body is a string
    res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8').toString());
    handleHead(res, status, headers);
    res.end(body);
    return halt;
  });
};

export const sendStream = (
  status: ?number,
  headers: ?Headers,
  body: Readable,
) => {
  return response((res) => {
    handleHead(res, status, headers);
    body.pipe(res);
    return halt;
  });
};

type Send = ((status: number, headers: Headers, body: Body) => *) &
  ((status: number, body: Body) => *) &
  ((body: Body) => *);

/**
 * Send content to the client.
 * @param {Number} status Status code to send.
 * @param {Object} headers Headers to send.
 * @param {String|Buffer|Readable} body Data to send.
 * @returns {App} App instance.
 */
const send: Send = (...rest: Array<*>): App => {
  let body: ?Body;
  let status: ?number = 200;
  let headers: ?Headers;

  if (rest.length === 3) {
    // $ExpectError
    status = rest[0];
    // $ExpectError
    headers = rest[1];
    // $ExpectError
    body = rest[2];
  } else if (rest.length === 2) {
    // $ExpectError
    status = rest[0];
    // $ExpectError
    body = rest[1];
  } else if (rest.length === 1) {
    // $ExpectError
    body = rest[0];
  } else {
    throw new TypeError('`send` expects 1, 2 or 3 arguments.');
  }

  if (typeof body === 'string' || Buffer.isBuffer(body)) {
    // TODO: FIXME: Why does flow hate this?
    // $ExpectError
    return sendBinary(status, headers, body);
  } else if (body && typeof body.pipe === 'function') {
    // TODO: FIXME: Why does flow hate this?
    // $ExpectError
    return sendStream(status, headers, body);
  }
  throw new TypeError('Invalid value given to `send`.');
};

export default send;
