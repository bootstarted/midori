/**
 * [function description]
 * @param {Boolean} secure True to enable security features.
 * @returns {Function} Middleware function.
 */
export default function({
  secure = process.env.NODE_ENV === 'production',
} = { }) {
  return function(app) {
    if (!secure) {
      return app;
    }
    const { request } = app;
    return {
      ...app,
      request(req, res) {
        // https://www.owasp.org/index.php/List_of_useful_HTTP_headers
        res.setHeader('Strict-Transport-Security', 'max-age=16070400');
        res.setHeader('X-Frame-Options', 'deny');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('X-Download-Options', 'noopen');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        // res.setHeader('Public-Key-Pins', '...');
        request(req, res);
      },
    };
  };
}
