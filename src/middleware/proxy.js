import Proxy from 'http-proxy';

/**
TODO: Handle these events:
proxy.on('proxyReq', (proxyReq, req, res, options) => { });
proxy.on('proxyRes', (proxyRes, req, res) => { });
*/

export default function(options) {
  const proxy = Proxy.createProxy();
  return (app) => {
    const { error } = app;

    return {
      ...app,
      request(req, res) {
        proxy.web(req, res, options, err => error(err, req, res));
      },
      upgrade(req, socket, head) {
        proxy.ws(req, socket, head, options, err => error(err, req));
      },
    };
  };
}
