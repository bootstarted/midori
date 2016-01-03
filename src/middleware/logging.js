
import morgan from 'morgan';
import finished from 'on-finished';

const dev = morgan('dev');

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
