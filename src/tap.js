// @flow
import next from './next';
import request from './request';

import type {App} from './types';
import type {IncomingMessage} from 'http';
type Handler = (req: IncomingMessage) => void;

/**
 * Introspect the request/response as its in flight but do not alter them and
 * do not change the current execution flow.
 * @param {Function} handler Tap function.
 * @returns {App} App instance.
 */
const tap = (handler: Handler): App => {
  return request((req) => {
    handler(req);
    return next;
  });
};

export default tap;
