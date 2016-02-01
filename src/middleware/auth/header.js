import {parse, format} from 'auth-header';
import isMatch from 'lodash/isMatch';

const advertisement = (match) => (app) => {
  const {request} = app;
  return {
    ...app,
    request(req, res) {
      res.setHeader('WWW-Authenticate', format(match));
      request(req, res);
    },
  };
};

export default (match) => (handler) => (app) => {
  const {scheme, params} = typeof match === 'object' ? match : parse(match);
  const {request, error} = app;

  return {
    ...app,
    request(req, res) {
      const auth = parse(req.headers.authorization);
      const next = (authenticated, authentication) => {
        req.authenticated = authenticated;
        req.authentication = authentication;
        request(req, res);
      };

      if (auth.scheme === scheme && isMatch(auth.params, params)) {
        handler(auth, next, error);
      } else {
        request(req, res);
      }
    },
  };
};

/*

const bearer = auth('Bearer');

const auth = bearer(({token}, result) => {
  if (token === 'magic') {
    result(true, {user: 'bob'})
  } else {
    result(false, {reason: 'ACCOUNT_EXPIRED'})
  }
});
*/
