/* @flow */
import createMockRequest from './createMockRequest';
import createMockResponse from './createMockResponse';

import type {App} from '../types';
import type {IncomingMessage, ServerResponse} from 'http';
import type {Readable} from 'stream';
import type {Socket} from 'net';
import {getUpgradeResponse} from '../response';

type Options = {
  method: string,
  headers: {[string]: string},
  body: string | Buffer | Readable,
  encrypted: boolean,
  offline: boolean,
  onError: (err: Error) => void,
  onNext: () => void,
  mapRequest: (req: IncomingMessage) => IncomingMessage,
};

type MockedResponse = ServerResponse & {
  statusMessage: ?string,
  body: ?Promise<string>,
  bodyActive: boolean,
  headers: {[string]: string | Array<string>},
  result: mixed,
  error: ?Error,
  socket: Socket,
};

const fetch = async (
  App: App,
  url?: string,
  _options?: Options,
): Promise<MockedResponse> => {
  let globalError = null;
  const options = _options || {};
  const stub: App = {
    request: () => {
      options.onNext && options.onNext();
    },
    requestError: (err: Error) => {
      globalError = err;
      options.onError && options.onError(err);
    },
    upgradeError: (err: Error) => {
      globalError = err;
      options.onError && options.onError(err);
    },
    // TODO: Do we need to check for errors here?
    error: /* istanbul ignore next */ () => {},
    close: () => {},
    upgrade: () => {
      options.onNext && options.onNext();
    },
    listening: () => {},
  };
  if (typeof App !== 'function') {
    throw new TypeError('Must pass valid app to `fetch`.');
  }
  const app = App(stub);

  let req = createMockRequest({
    url,
    method: options.method,
    headers: options.headers,
    body: options.body,
    encrypted: options.encrypted,
    offline: options.offline,
  });
  const res = createMockResponse();

  if (options.mapRequest) {
    // $ExpectError
    req = options.mapRequest((req: any));
  }

  // TODO: FIXME: Any better way of casting through `any`?
  // flowlint-next-line unclear-type: off
  const realRes: MockedResponse = (res: any);
  let result;
  if (
    typeof req.headers.connection === 'string' &&
    req.headers.connection.toLowerCase() === 'upgrade'
  ) {
    // flowlint-next-line unclear-type: off
    result = await app.upgrade((req: any), (res.socket: any), new Buffer(''));
  } else {
    // flowlint-next-line unclear-type: off
    result = await app.request((req: any), realRes);
  }

  // flowlint-next-line unclear-type: off
  const mock = getUpgradeResponse((req: any));
  if (mock) {
    res.headers = mock.headers;
    res.statusCode = mock.statusCode;
    res.statusMessage = mock.statusMessage;
    res.headersSent = mock.headersSent;
    res.finished = mock.finished;
  }
  if (globalError && !options.onError) {
    return Promise.reject(globalError);
  }
  realRes.error = globalError;
  realRes.result = result;
  if (res.bodyActive) {
    // FIXME: flow being stupid again
    // $ExpectError
    realRes.body = await res.body;
    return realRes;
  }
  return realRes;
};

export default fetch;
