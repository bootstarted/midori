
import Cookies from 'cookies';

// Switch to `cookies` instead of `cookie-parser` if desired.
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
