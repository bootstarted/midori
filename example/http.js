// @flow
import {request, halt, listen} from '../src';

const app = request((req, res) => {
  res.statusCode = 200;
  res.end('Hello world.');
  return halt;
});

listen(app, 8081);
