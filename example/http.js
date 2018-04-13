// @flow
import {response, halt, listen} from '../src';

const app = response((res) => {
  res.statusCode = 200;
  res.end('Hello world.');
  return halt;
});

listen(app, 8080);
