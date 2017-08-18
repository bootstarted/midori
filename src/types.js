// @flow
/* eslint-disable no-use-before-define */
import type {IncomingMessage, ServerResponse} from 'http';
import type {Socket} from 'net';

export type App = {
  stack: Array<Object>,
  matches: (req: IncomingMessage, res: ServerResponse) => boolean,
  request: (req: IncomingMessage, res: ServerResponse) => mixed,
  error: (err: Error, req: IncomingMessage, res: ServerResponse) => mixed,
  close: () => void,
  listening: () => void,
  upgrade: (req: IncomingMessage, socket: Socket, head: Buffer) => void,
};

export type AppCreator = (app: App) => App;
