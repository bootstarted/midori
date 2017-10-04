// @flow
import Cookies from 'cookies';
import request from './request';
import update from './assign';

import type {AppCreator} from './types';

/**
 * Attach cookie information to the request object.
 * @returns {Function} App creator.
 */
export default (): AppCreator => request((req, res) => {
  return update({cookies: new Cookies(req, res)}, null);
});
