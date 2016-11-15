import Cookies from 'cookies';

/**
 * [function description]
 * @returns {[type]} [description]
 */
export default function() {
  return function(app) {
    const { request } = app;
    return {
      ...app,
      request(req, res) {
        req.cookies = new Cookies(req, res);
        request(req, res);
      },
    };
  };
}
