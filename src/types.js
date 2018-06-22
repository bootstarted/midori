// @flow
import type {IncomingMessage, ServerResponse, Server} from 'http';
import type {Socket} from 'net';

export type InternalInstance = {|
  request: (req: IncomingMessage, res: ServerResponse) => mixed,
  requestError: (
    err: Error,
    req: IncomingMessage,
    res: ServerResponse,
  ) => mixed,
  upgrade: (req: IncomingMessage, socket: Socket, head: Buffer) => mixed,
  upgradeError: (
    err: Error,
    req: IncomingMessage,
    socket: Socket,
    head: Buffer,
  ) => mixed,
  close: () => mixed,
  listening: (server: Server) => mixed,
  error: (err: Error) => mixed,
|};

export type Matches = (req: IncomingMessage) => boolean;

export type Match = {|
  matches: Matches,
  app: InternalInstance,
|};

export type App = (app: InternalInstance) => InternalInstance;
export type MatchCreator = (app: InternalInstance) => Match;
