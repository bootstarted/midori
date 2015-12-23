
import Cookies from 'cookies';

// Switch to `cookies` instead of `cookie-parser` if desired.
export default function() {
  return function(next) {
    return function(req, res) {
      req.cookies = new Cookies(req, res);
      next(req, res);
    };
  };
}
