/* eslint-disable metalab/import/no-commonjs */
/* eslint-disable no-console */

const {compose, use, send, header} = require('../../');

const createApp = compose(
  use('/keep-alive', send('Hello World!')),
  use('/', header('Connection', 'close'), send('Hello World!')),
);

const app = createApp();

app.listen(8000, () => {
  console.log('Midori demo app listening on port 8000!');
});
