// @flow
import request from './request';
import halt from './halt';
import {format} from 'url';

import type {AppCreator} from './types';

type Redirect = {
  (url: URL): AppCreator;
  (url: string): AppCreator;
  (statusCode: number, url: string): AppCreator;
  (statusCode: number, url: URL): AppCreator;
}

type Normalize = {
  statusCode: number,
  url: string,
};

const normalize2 = (url: string | URL): string => {
  if (typeof url === 'string') {
    return url;
  } else if (typeof url === 'object') {
    return format(url);
  }
  throw new TypeError(`Invalid url: "${url}"`);
};

const normalize = (statusCode: number, url: string | URL): Normalize => {
  return {
    statusCode,
    url: normalize2(url),
  };
};

/**
 * Redirect somewhere. Ends the app chain.
 * @param {?Number} statusCode The status code to send back, defaults to 302.
 * @param {String|Object|Function} url The url to redirect to.
 * @returns {Function} App creator.
 */
const redirect:Redirect = (...args): AppCreator => {
  // TODO: FIXME: How to get flow happy with this?
  const {url, statusCode} = normalize(
    // $ExpectError
    args.length > 1 ? args[0] : 302,
    // $ExpectError
    args.length <= 1 ? args[0] : args[1]
  );
  return request((req, res) => {
    res.writeHead(statusCode, {
      Location: url,
    });
    res.end();
    return halt;
  });
};

export default redirect;
