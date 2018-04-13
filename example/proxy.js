// @flow
import {proxy, listen} from '../src';

const app = proxy({
  target: 'https://www.google.com',
  secure: false,
});

listen(app, 8080);
