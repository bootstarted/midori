import send from 'send';
import parse from 'parseurl';

/**
 * Server static files with `send`.
 * @param {Object} options Options based to `send`.
 * @returns {Function} Middleware function.
 */
export default (options) => {
  return function(app) {
    const { error } = app;
    return {
      ...app,
      request(req, res) {
        const url = parse(req);
        const path = req.path ?
          url.pathname.substr(req.path.length) : url.pathname;
        const stream = send(req, path, options);

        stream
          .on('error', (err) => error(err, req, res))
          // .on('directory', redirect)
          // .on('headers', headers)
          .pipe(res);
      },
    };
  };
};
