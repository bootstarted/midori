// @flow
import type {App} from './types';
import type {IncomingMessage} from 'http';
type RequestHandler = (req: IncomingMessage) => App | Promise<App>;

/**
 * Main thing.
 * @param {Function} handler Request handler. Must return another app.
 * @returns {App} App instance.
 */
const request = (handler: RequestHandler): App => (app) => {
  return {
    ...app,
    request: async (req, res) => {
      try {
        const nextApp = await handler(req);
        const result = await nextApp(app).request(req, res);
        return await result;
      } catch (err) {
        return await app.requestError(err, req, res);
      }
    },
    upgrade: async (req, socket, head) => {
      try {
        const nextApp = await handler(req);
        return await nextApp(app).upgrade(req, socket, head);
      } catch (err) {
        return await app.upgradeError(err, req, socket, head);
      }
    },
  };
};

request._selector = () => null;

export default request;
