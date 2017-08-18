// @flow
import baseApp from './internal/baseApp';
import validateApp from './internal/validateApp';
import handleResult from './internal/handleResult';

import type {App, AppCreator} from './types';
import type {IncomingMessage, ServerResponse} from 'http';
type RequestHandler = (req: IncomingMessage, res: ServerResponse) => (
  AppCreator | Promise<AppCreator>
);

/**
 * Main thing.
 * @param {Function} handler Request handler. Must return another app creator.
 * @returns {Function} App creator.
 */
export default (handler: RequestHandler) => (_app: ?App): App => {
  const app: App = {
    ...baseApp,
    ..._app,
  };
  validateApp(app);
  return {
    ...app,
    stack: [...app.stack, {type: 'REQUEST'}],
    request(req, res) {
      let result;
      try {
        result = handler(req, res);
      } catch (err) {
        return app.error(err, req, res);
      }
      return handleResult(result, app, req, res);
    },
  };
};
