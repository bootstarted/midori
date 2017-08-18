/* eslint no-console: 0 */
import {get, serve, compose} from '../src';

const createApp = compose(
  get('/foo', serve({root: __dirname})),
);

const app = createApp();

app.listen(8081);
