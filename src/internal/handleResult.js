// @flow
import type {App, AppCreator} from '../types';
import type {IncomingMessage, ServerResponse} from 'http';

const handleResult = (
  out: AppCreator | Promise<AppCreator>,
  app: App,
  req: IncomingMessage,
  res: ServerResponse
): mixed => {
  try {
    if (out && typeof out.then === 'function') {
      return out.then((result) => {
        return handleResult(result, app, req, res);
      }, (err) => {
        return app.error(err, req, res);
      });
    } else if (typeof out === 'function') {
      const next = out(app);
      return next.request(req, res);
    }
    throw new TypeError('Handler must return a middleware creator.');
  } catch (err) {
    return app.error(err, req, res);
  }
};

export default handleResult;
