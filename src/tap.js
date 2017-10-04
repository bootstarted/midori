// @flow
import request from './request';
import next from './next';

import type {AppCreator} from './types';
import type {IncomingMessage, ServerResponse} from 'http';
type Tap = (req: IncomingMessage, res: ServerResponse) => void;

/**
 * Introspect the request/response as its in flight but do not alter them and
 * do not change the current execution flow.
 * @param {Function} tap Function to invoke.
 * @returns {Function} App creator.
 */
export default (tap: Tap): AppCreator => request((req, res) => {
  tap(req, res);
  return next;
});
