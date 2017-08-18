/* eslint no-console: 0 */
import {request, pure} from '../src';

const createApp = request((req, res) => {
  res.statusCode = 200;
  res.end(`Hello ${req.id} [${req.locale}]`);
  return pure();
});

const app = createApp();

app.listen(8081);
