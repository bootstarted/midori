// @flow
import request from './request';
import pure from './pure';
import next from './next';

import type {AppCreator} from './types';

/**
 * Handle the case when the server is in the process of shutting down. This is
 * useful for upstream proxies that want to know that the server is not ready
 * to handle any more requests.
 * @returns {Function} App creator.
 */
export default (): AppCreator => request((req, res) => {
  if (req.socket._handle === null || req.socket._handle === undefined) {
    res.statusCode = 502;
    res.setHeader('Connection', 'close');
    res.setHeader('Content-Length', '0');
    res.end();
    return pure(null);
  }
  return next;
});
