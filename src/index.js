import base from './base';
import webpack from './webpack';

export function connect(app, server) {
  Object.keys(app).forEach(evt => {
    server.on(evt, app[evt]);
  });
  return server;
}

export { base, webpack };
