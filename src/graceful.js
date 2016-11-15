export default function() {
  return function(app) {
    const { request } = app;
    return {
      ...app,
      request(req, res) {
        if (!req.socket._handle) {
          res.statusCode = 502;
          res.setHeader('Connection', 'close');
          res.setHeader('Content-Length', 0);
          res.end();
        } else {
          request(req, res);
        }
      },
    };
  };
}
