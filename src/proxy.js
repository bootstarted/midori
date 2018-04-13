// @flow
import Proxy from 'http-proxy';

import type {App} from './types';
import type {ClientRequest, IncomingMessage} from 'http';

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
  onRequest?: (ClientRequest) => void,
  onResponse?: (IncomingMessage) => void,
};

export default function(options: Options): App {
  const proxy = Proxy.createProxy();
  if (options.onRequest) {
    proxy.on('proxyReq', options.onRequest);
  }
  if (options.onResponse) {
    proxy.on('proxyRes', options.onResponse);
  }
  return (app) => {
    return {
      ...app,
      request(req, res) {
        proxy.web(req, res, options, (err) => app.requestError(err, req, res));
      },
      upgrade(req, socket, head) {
        proxy.ws(req, socket, head, options, (err) =>
          app.upgradeError(err, req, socket, head),
        );
      },
    };
  };
}
