
import morgan from 'morgan';
import headers from 'on-headers';

const dev = morgan('dev');

export default function({ logger = dev }) {
  return function(next) {
    // TODO: https://github.com/expressjs/response-time/blob/master/index.js
    return (req, res) => {
      // Wait until before headers are sent in order to capture everything
      // that's gone on with the request. To correlate events you can use the
      // `tag` property.
      headers(res, () => {
        logger(req, res, () => {

        });
      });

      next(req, res);
    };
  };
}
