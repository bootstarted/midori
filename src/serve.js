// @flow
import send from 'send';
import parse from 'parseurl';
import request from './request';
import pure from './pure';
import next from './next';
import compose from './compose';
import status from './status';
import write from './send';

import type {AppCreator} from './types';
import type {IncomingMessage} from 'http';
type Options = {
  final: boolean,
  onDirectory: (directory: string) => AppCreator,
  acceptRanges: ?boolean,
  cacheControl: ?boolean,
  dotfiles: ?('allow' | 'deny' | 'ignore'),
  end: ?number,
  etag: ?boolean,
  extensions: ?Array<string>,
  immutable: ?boolean,
  index: ?boolean,
  lastModified: ?boolean,
  maxAge: ?(number | string),
  root: string,
  start: ?number,
};

const getBase = (req: IncomingMessage): string => {
  const url: URL = parse(req);
  if (typeof req.path === 'string') {
    return url.pathname.substr(req.path.length);
  }
  return url.pathname;
};

/**
 * Server static files with `send`.
 * @param {Object} options Options to pass through to `send`. You can see then
 * list of parameters here: https://www.npmjs.com/package/send
 * @param {Boolean} options.final True to terminate request handling here. You
 * can set this to `false` if you want to keep processing the app chain if a
 * file is not found.
 * @param {Function} options.onDirectory Invoked with a directory path when a
 * directory is encountered. You can use this to do things like provide a
 * directory listing or return some other status. Defaults to returning 204.
 * @returns {Function} App creator.
 */
export default ({
  final = true,
  onDirectory = () => compose(status(204), write('')),
  ...options
}: Options): AppCreator => request((req, res) => {
  const path = getBase(req);
  return new Promise((resolve, reject) => {
    const stream = send(req, path, options);
    stream
      .on('error', (err) => {
        if (err && err.code === 'ENOENT' && !final) {
          resolve(next);
        } else {
          reject(err);
        }
      })
      .on('directory', (res, path) => {
        resolve(onDirectory(path));
      })
      .pipe(res)
      .on('finish', () => {
        resolve(pure(null));
      });
  });
});
