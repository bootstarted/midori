// @flow
import connect from './connect';
import {createServer} from 'http';

import type {App, AppCreator} from './types';
import type {Server} from 'http';

type Callback = () => void;

type Listen = {
  (app: App | AppCreator, port: number): Server;
  (app: App | AppCreator, port: number, host: string): Server;
  (app: App | AppCreator, port: number, callback: Callback): Server;
  (app: App | AppCreator, callback: Callback): Server;
}

const listen: Listen = (app: App | AppCreator, ...rest: Array<*>) => {
  const server = createServer();
  connect(app, server);
  // TODO: FIXME: Make flow happy with this.
  // $ExpectError
  server.listen(...rest);
  return server;
};

export default listen;
