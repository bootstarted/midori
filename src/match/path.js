import url from 'parseurl';
import {parse, tokensToRegExp} from 'path-to-regexp';
import {combine} from './util';
import baseApp from '../internal/baseApp';

export default (_path) => (_app = {}) => {
  const app = {
    ...baseApp,
    ..._app,
  };
  const path = _path.replace(/\/$/, '');
  const tokens = [
    ...(app.tokens ? app.tokens : []),
    ...(path === '' ? [] : parse(path)),
  ];
  const keys = [];
  const regexp = tokensToRegExp(tokens, keys, {end: false});

  return {
    ...app,
    stack: [...app.stack, {type: 'PATH', path}],
    tokens,
    matches: combine(app, (req) => {
      const params = regexp.exec(url(req).pathname);
      if (params) {
        req.baseUrl = params[0];
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
