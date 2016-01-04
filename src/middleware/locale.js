import detect from 'negotiator/lib/language';

/**
 * Detect current locales.
 * @param {Array} locales Supported locales.
 * @returns {Function} Middleware function.
 */
export default function({ locales } = { }) {
  return function(app) {
    if (!locales) {
      return app;
    }
    const { request } = app;
    return {
      ...app,
      request(req, res) {
        req.locales = detect(req.headers['accept-language'], locales);
        req.locale = req.locales[0];
        request(req, res);
      },
    };
  };
}
