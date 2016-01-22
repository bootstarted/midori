export default function hapi(createMiddleware) {
  const middleware = createMiddleware({
    request: (req) => req.__reply.continue(),
    error: (err, req) => {
      if (req) {
        req.__reply(err);
      }
    },
  });
  return {
    type: 'onRequest',
    method: (request, reply) => {
      const { req, res } = request.raw;
      req.__reply = reply;
      middleware.request(req, res);
    },
  };
}
