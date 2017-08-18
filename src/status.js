// @flow
import request from './request';
import next from './next';

import type {IncomingMessage, ServerResponse} from 'http';
import type {AppCreator} from './types';

type StatusCode = number |
  (req: IncomingMessage, res: ServerResponse) => StatusCode |
  Promise<StatusCode>;

/**
 * Set the HTTP status code for the response.
 * @param {Number|Function|Promise} statusCode The status code to set.
 * @returns {Function} App creator.
 */
const status = (statusCode: StatusCode): AppCreator => {
  if (typeof statusCode === 'number') {
    const s:number = statusCode;
    return request((req, res) => {
      res.statusCode = s;
      return next;
    });
  } else if (typeof statusCode === 'function') {
    const s:((req: IncomingMessage, res: ServerResponse) => StatusCode) =
      (statusCode: any);
    return request((req, res) => status(s(req, res)));
  } else if (statusCode && typeof statusCode.then === 'function') {
    const result = statusCode.then((result) => status(result));
    return request(() => result);
  }
  throw new TypeError(`Invalid statusCode: ${statusCode}`);
};

export default status;
