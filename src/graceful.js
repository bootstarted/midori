// @flow
import request from './request';
import send from './send';
import next from './next';

import type {App} from './types';

/**
 * Handle the case when the server is in the process of shutting down. This is
 * useful for upstream proxies that want to know that the server is not ready
 * to handle any more requests.
 * @returns {App} App instance.
 */
export default (): App =>
  request((req) => {
    // TODO: Any way to make flow happy with this?
    // $ExpectError
    if (req.socket._handle === null || req.socket._handle === undefined) {
      return send(502, {Connection: 'close'}, '');
    }
    return next;
  });
