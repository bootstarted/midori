// @flow
import url from 'parseurl';
import {parse, tokensToRegExp} from 'path-to-regexp';

import type {IncomingMessage} from 'http';
import type {MatchCreator, Match} from '../types';

const isAbsolutePath = (path: string) => /^\//.test(path);

type Params = {[string]: string};

export const params: WeakMap<IncomingMessage, Params> = new WeakMap();
export const baseUrl: WeakMap<IncomingMessage, string> = new WeakMap();

export default (_path: string): MatchCreator => {
  if (!isAbsolutePath(_path)) {
    throw new TypeError('Must give absolute path.');
  }
  return (app): Match => {
    const path = _path.replace(/\/$/, '');
    const tokens = [
      // TODO: FIXME: Make flow happy.
      // $ExpectError
      ...(app && Array.isArray(app.tokens) ? app.tokens : []),
      ...(path === '' ? [] : parse(path)),
    ];
    const keys: Array<{name: string}> = [];
    const regexp = tokensToRegExp(tokens, keys, {end: false});

    // TODO: FIXME: Make flow happy.
    // $ExpectError
    return {
      app: {
        tokens,
        ...app,
      },
      matches: (req) => {
        const urlParams = regexp.exec(url(req).pathname);
        if (urlParams) {
          const newParams: {[string]: string} = params.get(req) || {};
          keys.forEach(({name}, i) => {
            newParams[name] = urlParams[i + 1];
          });
          params.set(req, newParams);
          baseUrl.set(req, urlParams[0]);
          return true;
        }
        return false;
      },
    };
  };
};
