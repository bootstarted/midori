// @flow
import {installUpgradeResponse} from './response';
import type {App} from './types';
import type {IncomingMessage} from 'http';
import type {Socket} from 'net';
type UpgradeHandler = ({
  req: IncomingMessage,
  socket: Socket,
  head: Buffer,
}) => App | Promise<App>;

/**
 * Main thing.
 * @param {Function} handler Request handler. Must return another app creator.
 * @returns {App} App instance.
 */
const upgrade = (handler: UpgradeHandler): App => (app) => {
  return {
    ...app,
    upgrade: async (req, socket, head) => {
      try {
        installUpgradeResponse(req, socket);
        const nextApp = await handler({req, socket, head});
        return nextApp(app).upgrade(req, socket, head);
      } catch (err) {
        return app.upgradeError(err, req, socket, head);
      }
    },
    request: (req, res) => {
      const error = new Error('Must only pass upgrade events to `upgrade`.');
      return app.requestError(error, req, res);
    },
  };
};

upgrade._selector = () => null;

export default upgrade;
