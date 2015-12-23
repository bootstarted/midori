import detect from 'negotiator/lib/language';

export default function({ locales }) {
  return function(next) {
    return function(req, res) {
      req.locales = detect(req.headers['accept-language'], locales);
      req.locale = req.locales[0];
      next(req, res);
    };
  };
}
