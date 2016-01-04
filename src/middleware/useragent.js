import { lookup } from 'useragent';

/**
 * Attach an `agent` property containing useragent information.
 * @returns {Function} Middleware function.
 */
export default function() {
  return function(app) {
    const { request } = app;
    return {
      ...app,
      request(req, res) {
        req.agent = lookup(req.headers['user-agent']);
        request(req, res);
      },
    };
  };
}
