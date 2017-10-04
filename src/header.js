// @flow
import next from './next';
import request from './request';

import type {IncomingMessage, ServerResponse} from 'http';
import type {AppCreator} from './types';

type Value = string |
  (req: IncomingMessage, res: ServerResponse) => Value |
  Promise<Value>;

/**
 * Set an HTTP response header.
 * @param {String} name Name of the header to set.
 * @param {String|Promise|Function} value Value to set the header to.
 * @returns {Function} App creator.
 */
const header = (name: string, value: Value): AppCreator => {
  if (!value) {
    return next;
  } else if (typeof value === 'string') {
    const r:string = value;
    return request((req, res) => {
      res.setHeader(name, r);
      return next;
    });
  } else if (typeof value === 'function') {
    const r:((req: IncomingMessage, res: ServerResponse) => Value) =
      (value: any);
    return request((req, res) => header(name, r(req, res)));
  } else if (value && typeof value.then === 'function') {
    const result = value.then((result) => header(name, result));
    return request(() => result);
  }
  throw new TypeError(`Invalid value for header: ${value}`);
};

export default header;
