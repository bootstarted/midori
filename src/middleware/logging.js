import morgan from 'morgan';
import finished from 'on-finished';

// Make mogan use the timing middleware we provide.
morgan.token('response-time', (req, res, digits) => {
  const ms = (res.timing.headers - req.timing.start) * 1e3;
  return ms.toFixed(digits === undefined ? 3 : digits);
});

// Since logging happens at the end of the request cycle, morgan does not need
// to install any of its own lifecycle hooks; therefore set the immediate flag.
const dev = morgan('dev', { immediate: true });

export default function({ logger = dev } = { }) {
  return function(app) {
    const { request, error } = app;
    return {
      ...app,
      request(req, res) {
        // Wait until before headers are sent in order to capture everything
        // that's gone on with the request. To correlate events you can use the
        // `tag` property.
        finished(res, () => {
          logger(req, res, err => {
            if (err) {
              error(err);
            }
          });
        });
        request(req, res);
      },
    };
  };
}
