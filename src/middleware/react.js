
export default function({
  store: createStore,
  state: createInitialState,
  reducer,
}) {
  return function(app) {
    return {
      ...app,
      request(req, res) {
        // const store = createStore(reducer, createInitialState(req, res));

        res.statusCode = 200;
        res.setHeader('Allow', 'GET');
        res.setHeader('Content-Type', 'text/html; charset="utf-8"');
        res.setHeader('Content-Language', 'en-US');
        res.setHeader('X-UA-Compatible', 'IE=Edge,chrome=1');
        // TODO: .set('Content-Security-Policy', csp(result))

        res.end();
      },
    };
  };
}
