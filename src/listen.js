// @flow
import connect from './connect';
import {createServer} from 'http';

import type {App} from './types';
import type {Server} from 'http';

type Callback = () => void;

type Listen = {
  (app: App, port: number): Server,
  (app: App, port: number, host: string): Server,
  (app: App, port: number, callback: Callback): Server,
  (app: App, callback: Callback): Server,
};

/**
 * Convenience function to create an HTTP server and automatically connect to it
 * and start listening. The first argument is an app, but the rest are whatever
 * the http server's `listen` function accepts. (e.g. port, callback, etc.)
 * @param {App} app App instance.
 * @returns {Server} HTTP server instance.
 */
const listen: Listen = (app: App, ...rest: Array<*>) => {
  const server = createServer();
  connect(
    app,
    server,
  );
  // TODO: FIXME: Make flow happy with this.
  // $ExpectError
  server.listen(...rest);
  return server;
};

export default listen;
