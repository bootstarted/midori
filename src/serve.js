// @flow
import send from 'send';
import parse from 'parseurl';
import request from './request';
import pure from './pure';

import type {AppCreator} from './types';
import type {IncomingMessage} from 'http';

const getBase = (req: IncomingMessage): string => {
  const url: URL = parse(req);
  if (typeof req.path === 'string') {
    return url.pathname.substr(req.path.length);
  }
  return url.pathname;
};

/**
 * Server static files with `send`.
 * @param {Object} options Options to pass through to `send`.
 * @returns {Function} App creator.
 */
export default (options: Object): AppCreator => request((req, res) => {
  const path = getBase(req);
  const stream = send(req, path, options);
  stream
    // .on('error', (err) => app.error(err, req, res))
    // .on('directory', redirect)
    // .on('headers', headers)
    .pipe(res);
  return pure(null);
});
