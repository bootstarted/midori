import url from 'parseurl';
import {parse, tokensToRegExp} from 'path-to-regexp';
import {combine} from './util';

export default (path) => (app) => {
  const tokens = [
    ...(app.tokens || []),
    ...(path === '/' ? [] : parse(path)),
  ];
  const regexp = tokensToRegExp(tokens, { end: false });
  const keys = tokens.filter(t => typeof t === 'object');

  return {
    ...app,
    tokens,
    matches: combine(app, (req) => {
      const params = regexp.exec(url(req).pathname);
      if (params) {
        req.path = params[0];
        req.params = req.params || {};
        keys.forEach(({name}, i) => {
          req.params[name] = params[i + 1];
        });
        return true;
      }
      return false;
    }),
  };
};
