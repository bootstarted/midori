// @flow
import url from 'parseurl';
import {parse, tokensToRegExp} from 'path-to-regexp';

import type {App, Match} from '../types';

const isAbsolutePath = (path: string) => /^\//.test(path);

export default (_path: string) => {
  if (!isAbsolutePath(_path)) {
    throw new TypeError('Must give absolute path.');
  }
  return (app: App): Match => {
    const path = _path.replace(/\/$/, '');
    const tokens = [
      ...(app && Array.isArray(app.tokens) ? app.tokens : []),
      ...(path === '' ? [] : parse(path)),
    ];
    const keys: Array<{name: string}> = [];
    const regexp = tokensToRegExp(tokens, keys, {end: false});

    return {
      app: {
        tokens,
        ...app,
      },
      matches: (req) => {
        const urlParams = regexp.exec(url(req).pathname);
        if (urlParams) {
          const baseUrl = urlParams[0];
          const params: {[string]: mixed} = typeof req.params === 'object' &&
            req.params !== null ? req.params : {};
          keys.forEach(({name}, i) => {
            params[name] = urlParams[i + 1];
          });
          // $ExpectError
          req.baseUrl = baseUrl;
          // $ExpectError
          req.params = params;
          return true;
        }
        return false;
      },
    };
  };
};
