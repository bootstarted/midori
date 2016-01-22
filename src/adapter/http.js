export default function connect(app, server) {
  Object.keys(app).forEach(evt => {
    server.on(evt, app[evt]);
  });
  return server;
}
