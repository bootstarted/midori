import noop from 'lodash/utility/noop';

/**
 * [function description]
 * @param {Object} app Middleware object.
 * @returns {Object} Previous middleware object with defaults.
 */
export default function(app) {
  return {
    error(err) {
      throw err;
    },
    request(req, res) {
      res.statusCode = 404;
      res.end();
    },
    listening: noop,
    upgrade: noop,
    close: noop,
    ...app,
  };
}
