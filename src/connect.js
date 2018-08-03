// @flow
import baseApp from './internal/baseApp';

import type {App} from './types';
import type {Server} from 'http';

const keys = ['request', 'upgrade', 'close', 'error', 'listening'];

/**
 * Wire up an app to an HTTP server instance. Connects all the corresponding
 * event handlers.
 * @param {App} app App to connect to given server.
 * @param {Object} server HTTP server instance to attach listeners to.
 * @returns {Object} The server object.
 */
export default function connect(app: App, server: Server) {
  if (typeof app !== 'function') {
    throw new TypeError('Must pass valid app to `connect`.');
  }
  const inst = app(baseApp);
  server.on('request', (req, res) => {
    req.on('error', (err) => {
      inst.requestError(err, req, res);
    });
    res.on('error', (err) => {
      inst.requestError(err, req, res);
    });
  });
  server.on('upgrade', (req, socket, head) => {
    socket.on('error', (err) => {
      inst.upgradeError(err, req, socket, head);
    });
    req.on('error', (err) => {
      inst.upgradeError(err, req, socket, head);
    });
  });
  keys.forEach((evt) => {
    if (typeof inst[evt] === 'function') {
      server.on(evt, inst[evt]);
    }
  });
  if (server.listening === true) {
    inst.listening.call(server, server);
  }
  return server;
}
