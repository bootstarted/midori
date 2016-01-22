export default function express(createMiddleware) {
  const middleware = createMiddleware({
    error: (err, req) => {
      if (req) {
        req.__next(err);
      }
    },
    request: (req) => {
      req.__next();
    },
  });
  return (req, res, next) => {
    req.__next = next;
    middleware.request(req, res);
  };
}
