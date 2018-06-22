// @flow
import {listen, request, send, apply, createSelector} from '../src';

const wait = (sec, value) =>
  createSelector(request, (_req) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value);
      }, sec);
    });
  });

const app = apply(
  wait(1000, 'hello'),
  wait(2000, 'from'),
  wait(3000, 'bob'),
  (a, b, c) => {
    return send(200, [a, b, c].join(' '));
  },
);

listen(app, 8080);
