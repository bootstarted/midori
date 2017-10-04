// @flow

import type {App} from './types';
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
 * @param {Object} app App to connect.
 * @param {Object} server HTTP server instance to attach listeners to.
 * @returns {Object} The server object.
 */
export default function connect(app: App, server: Server) {
  keys.forEach((evt) => {
    if (typeof app[evt] === 'function') {
      server.on(evt, app[evt]);
    }
  });
  return server;
}
