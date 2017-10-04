import Proxy from 'http-proxy';
import baseApp from './internal/baseApp';
import validateApp from './internal/validateApp';
/**
TODO: Handle these events:
proxy.on('proxyReq', (proxyReq, req, res, options) => { });
proxy.on('proxyRes', (proxyRes, req, res) => { });
*/

export default function(options) {
  const proxy = Proxy.createProxy();
  return (_app) => {
    const app = {
      ...baseApp,
      ..._app,
    };
    validateApp(app);
    return {
      ...app,
      request(req, res) {
        proxy.web(req, res, options, (err) => app.error(err, req, res));
      },
      upgrade(req, socket, head) {
        proxy.ws(req, socket, head, options, (err) => app.error(err, req));
      },
    };
  };
}
