/* eslint no-console: 0 */
import compose from 'lodash/flowRight';
import http from 'http';
import send from '../src/send';
import thunk from '../src/thunk';
import connect from '../src/connect';

const createApp = compose(
  thunk((app) => {
    const a = send('Hello')(app);
    const b = send('World')(app);
    return () => {
      return (Math.random() > 0.5) ? a : b;
    };
  })
);

const app = createApp({
  request(req, res) {
    console.log('UNREACHABLE');
    res.end();
  },
  error(err) {
    console.log('GOT ERROR', err);
  },
});

connect(app, http.createServer()).listen(8081);
