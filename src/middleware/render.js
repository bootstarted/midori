export default ({
  request = () => {},
  error = () => {},
  createStore = () => ({}),
  render = () => {},
}) => (app)=> {
  const handleEvent = (mapArgs, handler) => (...args) => {
    const { req, res } = mapArgs(...args);
    const store = createStore();
    req.store = store;

    // Populate store state from request state
    handler(...args, store);

    return Promise.resolve()
      .then(() => render(req, res, store))
      .then((result) => {
        req.render = result;
        req.body = result.markup;
        app.request(req, res);
      })
      .catch((err) => {
        app.error(err, req, res);
      });
  };

  return {
    ...app,
    error: handleEvent((err, req, res) => ({ req, res }), error),
    request: handleEvent((req, res) => ({ req, res }), request),
  };
};
