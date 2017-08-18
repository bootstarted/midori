// @flow
import baseApp from './internal/baseApp';
import validateApp from './internal/validateApp';
import handleResult from './internal/handleResult';

import type {App, AppCreator} from './types';
import type {IncomingMessage, ServerResponse} from 'http';
type ErrorHandler = (
  err: Error,
  req: IncomingMessage,
  res: ServerResponse,
  app: App,

) => AppCreator | Promise<AppCreator>;
/**
 * Handle errors.
 * @param {Function} errorHandler Thing to handle errors. Must return another
 * app creator.
 * @returns {Function} App creator.
 */
export default (errorHandler: ErrorHandler) => (_app: ?App): App => {
  const app = {
    ...baseApp,
    ..._app,
  };
  validateApp(app);
  return {
    ...app,
    error: (err, req, res) => {
      try {
        return handleResult(
          errorHandler(err, req, res, app),
          app,
          req,
          res,
        );
      } catch (err) {
        return app.error(err, req, res);
      }
    },
  };
};
