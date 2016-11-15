/* eslint no-console: 0 */
import compose from 'lodash/flowRight';
import http from 'http';
import serve from '../src/serve';
import status from '../src/status';
import send from '../src/send';
import verbs from '../src/match/verbs';
import connect from '../src/connect';

const createApp = compose(
  verbs.get('/foo', serve({ root: __dirname })),
  compose(status(404), send()),
);

const app = createApp({
  request() {
    console.log('GOT REQUEST');
  },
  error(err) {
    console.log('GOT ERROR', err);
  },
});

connect(app, http.createServer()).listen(8081);
