// @flow
import request from './request';
import halt from './halt';

import {Readable} from 'stream';

type Body = string |
  Buffer |
  Readable;

const sendBinary = (body: string | Buffer) => {
  return request((req, res) => {
    res.setHeader('Content-Length', body.length.toString());
    res.end(body);
    return halt;
  });
};

export const sendStream = (body: Readable) => {
  return request((req, res) => {
    body.pipe(res);
    return halt;
  });
};

/**
 * Send content to the client.
 * @param {String|Buffer|Readable} body Data to send.
 * @returns {Function} App creator.
 */
const send = (body: Body) => {
  if (typeof body === 'string' || Buffer.isBuffer(body)) {
    // TODO: FIXME: Why does flow hate this?
    // $ExpectError
    return sendBinary(body);
  } else if (body && typeof body.pipe === 'function') {
    // TODO: FIXME: Why does flow hate this?
    // $ExpectError
    return sendStream(body);
  }
  throw new TypeError('Invalid value given to `send`.');
};

export default send;
