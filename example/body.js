// @flow
import {createSelector, body, use, send, compose, listen} from '../src';

const json = createSelector(body, (body) => {
  return JSON.parse(body.toString());
});

const app = compose(
  use(
    '/raw',
    body((data) => {
      return send(data);
    }),
  ),
  use(
    '/json',
    json((data) => {
      return send(JSON.stringify(data));
    }),
  ),
);

listen(app, 8080);
