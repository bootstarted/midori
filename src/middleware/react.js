export default function({

}) {
  return function(app) {
    const { error: nextError } = app;

    function error(err, context) {
      // if error is a request error then try to display an error page
      if (context.req) {
        try {
          send(context.req, context.res, {
            status: err.status || 500,
          });
        } catch (err) {
          nextError(err, context);
        }
      }
      nextError(err, context);
    }

    function send(req, res, {status, locale, markup}) {
      res.statusCode = status;
      res.setHeader('Allow', 'GET');
      res.setHeader('Content-Type', 'text/html; charset="utf-8"');
      res.setHeader('Content-Language', locale);
      res.setHeader('X-UA-Compatible', 'IE=Edge,chrome=1');
      // TODO: .set('Content-Security-Policy', csp(result))

      res.end(markup);
    }

    return {
      ...app,
      error,
      request(req, res) {
        // const store = createStore(reducer, createInitialState(req, res));
        const state = { };

        // Extract useful header information from react app state.
        send(req, res, state);
      },
    };
  };
}
