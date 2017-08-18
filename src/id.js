// @flow
import uuid from 'uuid';
import request from './request';
import update from './assign';

import type {AppCreator} from './types';

/**
 * Attach what is essentially a "transaction id" for being able to correlate
 * the request with other events; it can be referenced by other modules, other
 * logging systems or even the front-end client.
 * @returns {Function} App creator.
 */
export default (): AppCreator => request((req, res) => {
  // See: http://stackoverflow.com/a/26386900
  const id = uuid.v1();
  res.setHeader('Request-Id', id);
  return update({id}, null);
});
