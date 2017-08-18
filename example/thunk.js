/* eslint no-console: 0 */
import {request, send} from '../src';

const a = send('Hello');
const b = send('World');

const createApp = request(() => {
  return (Math.random() > 0.5) ? a : b;
});

const app = createApp();

app.listen(8081);
