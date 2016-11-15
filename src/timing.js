import headers from 'on-headers';
import finished from 'on-finished';

/**
 * Get the current timestamp in seconds.
 * @returns {Number} Timestamp.
 */
function stamp() {
  const time = process.hrtime();
  return time[0] + time[1] * 1e-9;
}

/**
 * Attach timing information to the HTTP request and response objects. Note that
 * to use the timing results this function has to be called first in the
 * middleware chain.
 * @returns {Function} Middleware function.
 */
export default function() {
  return function(app) {
    const { request } = app;
    return {
      ...app,
      request(req, res) {
        req.timing = { };
        res.timing = { };
        req.timing.start = stamp();
        finished(req, () => {
          req.timing.end = stamp();
        });
        headers(res, () => {
          res.timing.headers = stamp();
        });
        finished(res, () => {
          res.timing.end = stamp();
        });
        request(req, res);
      },
    };
  };
}
