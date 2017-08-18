/* eslint no-console: 0 */
import {proxy} from '../src';

const createApp = proxy({
  target: 'https://www.google.com',
  secure: false,
});

const app = createApp();

app.listen(8081);
