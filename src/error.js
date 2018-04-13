// @flow
import type {App} from './types';

type ErrorHandler = (err: Error) => App | Promise<App>;

const error = (errorHandler: ErrorHandler): App => (app) => {
  return {
    ...app,
    requestError: async (err, req, res) => {
      try {
        const nextApp = await errorHandler(err);
        return nextApp(app).request(req, res);
      } catch (err) {
        return app.requestError(err, req, res);
      }
    },
    upgradeError: async (err, req, socket, head) => {
      try {
        const nextApp = await errorHandler(err);
        return nextApp(app).upgrade(req, socket, head);
      } catch (err) {
        return app.upgradeError(err, req, socket, head);
      }
    },
  };
};

export default error;
