// @flow
import uuid from 'uuid';
import request from './request';
import compose from './compose';
import apply from './apply';
import header from './header';

import type {App} from './types';

/**
 * Attach what is essentially a "transaction id" for being able to correlate
 * the request with other events; it can be referenced by other modules, other
 * logging systems or even the front-end client.
 * @param {Function} fn id -> App
 * @returns {App} App instance.
 */
export default (fn: (string) => App) =>
  apply(request, (_req) => {
    // See: http://stackoverflow.com/a/26386900
    const id = uuid.v1();
    return compose(
      header('Request-Id', id),
      fn(id),
    );
  });
