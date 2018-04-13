// @flow
import type {IncomingMessage, ServerResponse, Server} from 'http';
import type {Socket} from 'net';

export type App = {
  request: (req: IncomingMessage, res: ServerResponse) => mixed,
  error: (err: Error, req: IncomingMessage, res: ServerResponse) => mixed,
  close: () => void,
  listening: (server: Server) => void,
  upgrade: (req: IncomingMessage, socket: Socket, head: Buffer) => void,
};

export type Matches = (req: IncomingMessage) => boolean;

export type Match = {
  matches: Matches,
  app: App,
};

export type AppCreator = (app: App) => App;
export type MatchCreator = (app: App) => Match;
