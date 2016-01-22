
export default function express(createMiddleware) {
  return (req, res, next) => {
    const middleware = createMiddleware({
      error: next,
      request: () => next(),
    });
    middleware.request(req, res);
  };
}
