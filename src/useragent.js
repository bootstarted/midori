// @flow
import {lookup} from 'useragent';
import request from './request';
import update from './assign';

import type {AppCreator} from './types';

/**
 * Attach an `agent` property to the request containing useragent information.
 * @returns {Function} Middleware function.
 */
export default (): AppCreator => request((req) => {
  const agent = lookup(req.headers['user-agent']);
  return update({agent}, null);
});
