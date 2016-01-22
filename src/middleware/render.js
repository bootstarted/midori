export default ({
  request = () => {},
  error = () => {},
  createStore = () => ({}),
  render = () => {},
}) => (app)=> {
  const handleEvent = (mapParams, handler) => (...params) => {
    const { req, res } = mapParams(...params);
    const store = createStore();
    req.store = store;

    // Populate store state from request state
    handler(...params, store);

    Promise.resolve(render(req, res, store))
      .catch((err) => app.error(err, req, res));
  };

  return {
    ...app,
    error: handleEvent((err, req, res) => ({ req, res }), error),
    request: handleEvent((req, res) => ({ req, res }), request),
  };
};
