// @flow
import Cookies from 'cookies';
import {apply, createSelector, request, response, send, listen} from '../src';

const cookies = (options) =>
  createSelector(
    request,
    response,
    (req, res) => new Cookies(req, res, options),
  );

const app = apply(cookies(), (cookies) => {
  const value = parseInt(cookies.get('counter') || 0, 10);
  cookies.set('counter', (value + 1).toString());
  return send(200, `Got cookie: ${value}.`);
});

listen(app, 8080);
