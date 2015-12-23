import { lookup } from 'useragent';

export default function() {
  return function(next) {
    return function(req, res) {
      req.agent = lookup(req.headers['user-agent']);
      next(req, res);
    };
  };
}
