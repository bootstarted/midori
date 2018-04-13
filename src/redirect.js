// @flow
import send from './send';
import {format} from 'url';

import type {App} from './types';

type Redirect = {
  (url: URL): App,
  (url: string): App,
  (statusCode: number, url: string): App,
  (statusCode: number, url: URL): App,
};

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
 * @returns {App} App instance.
 */
const redirect: Redirect = (...args): App => {
  // TODO: FIXME: How to get flow happy with this?
  const {url, statusCode} = normalize(
    // $ExpectError
    args.length > 1 ? args[0] : 302,
    // $ExpectError
    args.length <= 1 ? args[0] : args[1],
  );
  return send(
    statusCode,
    {
      Location: url,
    },
    '',
  );
};

export default redirect;
