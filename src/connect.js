// @flow
import baseApp from './internal/baseApp';

import type {App, AppCreator} from './types';
import type {Server} from 'http';

const keys = [
  'request',
  'upgrade',
  'close',
  'error',
  'listening',
];

/**
 * Wire up an app to an HTTP server instance. Connects all the corresponding
 * event handlers.
 * @param {Object|Function} app App or app creator to connect.
 * @param {Object} server HTTP server instance to attach listeners to.
 * @returns {Object} The server object.
 */
export default function connect(app: App | AppCreator, server: Server) {
  if (typeof app === 'function') {
    return connect(app(baseApp), server);
  }
  keys.forEach((evt) => {
    if (typeof app[evt] === 'function') {
      server.on(evt, app[evt]);
    }
  });
  if (server.listening === true) {
    app.listening.call(server, server);
  }
  return server;
}
