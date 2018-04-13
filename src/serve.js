// @flow
import send from 'send';
import onFinished from 'on-finished';
import apply from './apply';
import request from './request';
import response from './response';
import halt from './halt';
import next from './next';
import write from './send';
import baseUrl from './baseUrl';
import url from './url';

import type {App} from './types';

type Options = {
  final?: boolean,
  onDirectory?: (directory: string) => App,
  acceptRanges?: boolean,
  cacheControl?: boolean,
  dotfiles?: 'allow' | 'deny' | 'ignore',
  end?: number,
  etag?: boolean,
  extensions?: Array<string>,
  immutable?: boolean,
  index?: boolean,
  lastModified?: boolean,
  maxAge?: number | string,
  root: string,
  start?: number,
};

const getPath = (baseUrl: string, pathname: string): string => {
  return pathname.substr(baseUrl.length);
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
 * @returns {App} App instance.
 */
export default ({
  final = true,
  onDirectory = () => write(204, ''),
  ...options
}: Options): App =>
  apply(request, response, baseUrl, url, (req, res, baseUrl, {pathname}) => {
    return new Promise((resolve, reject) => {
      const stream = send(req, getPath(baseUrl, pathname), options);
      onFinished(res, () => resolve(halt));
      stream
        .once('error', (err) => {
          if (err && (err.code === 'ENOENT' || err.status === 404) && !final) {
            resolve(next);
          } else {
            reject(err);
          }
        })
        .once('directory', (res, path) => {
          resolve(onDirectory(path));
        })
        .pipe(res);
    });
  });
