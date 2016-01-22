
export default function hapi(createMiddleware) {
  return {
    type: 'onRequest',
    method: (request, reply) => {
      const { req, res } = request.raw;
      const middleware = createMiddleware({
        request: () => reply.continue(),
        error: (err) => reply(err),
      });
      middleware.request(req, res);
    },
  };
}
