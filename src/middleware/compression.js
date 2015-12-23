
import compression from 'compression';

export default function() {
  const compressor = compression();
  return function(next) {
    return function(req, res) {
      compressor(req, res, err => {
        next(req, res);
      });
    };
  };
}
