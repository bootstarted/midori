// @flow
import Proxy from 'http-proxy';
import baseApp from './internal/baseApp';

import type {App, AppCreator} from './types';

/**
TODO: Handle these events:
proxy.on('proxyReq', (proxyReq, req, res, options) => { });
proxy.on('proxyRes', (proxyRes, req, res) => { });
*/

type Options = {
  target?: string | {host: string, port: number},
  forward?: string,
  agent?: *,
  ssl?: *,
  ws?: boolean,
  xfwd?: boolean,
  secure?: boolean,
  toProxy?: boolean,
  prependPath?: boolean,
  ignorePath?: boolean,
  localAddress?: string,
  changeOrigin?: boolean,
  preserveHeaderKeyCase?: boolean,
  auth?: string,
  hostRewrite?: boolean,
  autoRewrite?: boolean,
  protocolRewrite?: boolean,
  cookieDomainRewrite?: false | string | {[string]: string},
  headers?: {[string]: string},
  proxyTimeout?: number,
}

export default function(options: Options): AppCreator {
  const proxy = Proxy.createProxy();
  return (_app: App) => {
    const app = {
      ...baseApp,
      ..._app,
    };
    return {
      ...app,
      request(req, res) {
        proxy.web(req, res, options, (err) => app.error(err, req, res));
      },
      upgrade(req, socket, head) {
        // TODO: FIXME: Should we have a separate error handler here?
        // $ExpectError
        proxy.ws(req, socket, head, options, (err) => app.error(err, req));
      },
    };
  };
}
