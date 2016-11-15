import preferred from 'negotiator';

export default (allowed) => (app) => ({
  ...app,
  request(req, res) {
    const types = preferred(req.headers.accept, allowed);
    if (types.length === 0) {
      app.error();
    } else {
      req.accepts = types;
      app.request(req, res);
    }
  },
});
