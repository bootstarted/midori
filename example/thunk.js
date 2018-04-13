// @flow
import {request, send, listen} from '../src';

const a = send('Hello');
const b = send('World');

const app = request(() => {
  return Math.random() > 0.5 ? a : b;
});

listen(app, 8080);
