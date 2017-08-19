import compression from 'compression';

/**
 * [function description]
 * @returns {[type]} [description]
 */
export default function() {
  const compressor = compression();
  return function(app) {
    const { request, error } = app;
    return {
      ...app,
      request(req, res) {
        compressor(req, res, err => {
          if (err) {
            error(err, req, res);
          } else {
            request(req, res);
          }
        });
      },
    };
  };
}