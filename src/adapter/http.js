export default function connect(app, server) {
  Object.keys(app).forEach(evt => {
    if (typeof app[evt] === 'function') {
      server.on(evt, app[evt]);
    }
  });
  return server;
}
