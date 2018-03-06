// @flow
// flowlint untyped-import: off
import Cookies from 'cookies';
// flowlint untyped-import: error
import request from './request';
import update from './assign';

import type {AppCreator} from './types';

declare class CookiesClass {
  get(name: string, options?: {
    signed?: boolean,
  }): ?string;
  set(name: string, value?: string, options?: {
    maxAge?: number,
    expires?: Date,
    path?: string,
    domain?: string,
    secure?: boolean,
    httpOnly?: boolean,
    sameSite?: boolean | 'strict' | 'lax',
    signed?: boolean,
    overwrite?: boolean,
  }): void;
}

type Options = {
  secure?: boolean,
  keys: Array<string>,
};

/**
 * Attach cookie information to the request object.
 * @param {Object?} options Cookies options.
 * @returns {Function} App creator.
 */
export default (options: ?Options): AppCreator => request((req, res) => {
  const cookies: CookiesClass = new Cookies(req, res, options);
  return update({cookies}, null);
});
