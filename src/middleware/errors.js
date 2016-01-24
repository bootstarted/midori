import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import accepts from 'accepts';

export const DEFAULT_STATUS = 500;
export const MIN_STATUS = 400;
export const MAX_STATUS = 600;

export const getStatusCode = (err = {}) => {
  const status = err.status || err.statusCode;
  return status >= MIN_STATUS && status < MAX_STATUS
    ? status
    : DEFAULT_STATUS;
};

export const text = (err, req, res) => {
  const status = getStatusCode(err);
  const stack = `${err.stack}\n\n`;
  const message = err.message ? `${err.message}\n\n` : '';
  const body = `Error ${status}\n\n${message}${stack}`;

  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(body);
};

export const html = (err, req, res) => {
  const status = getStatusCode(err);
  const stack = `<pre>${err.stack}</pre>`;
  const message = err.message ? `<code>${err.message}</code>` : '';
  const body = `<!DOCTYPE html>
<html>
<head>
<title>Error ${status}</title>
<style>
body{font-family: sans-serif; color: #333}
</style>
</head>
<body>
<h1>Error ${status}</h1>
${message}
${stack}
</body>
</html>`;

  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(body);
};

export const json = (err, req, res) => {
  const status = getStatusCode(err);
  const { message, stack } = err;
  const json = JSON.stringify({ error: { message, stack } });

  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(json);
};

export const defaultHandlers = { html, text, json };

export default ({
  handlers = defaultHandlers,
  handler,
  sniff = true,
} = {}) => (app) => {
  return {
    ...app,
    error(err, req, res) {
      if (sniff && !handler) {
        const accept = accepts(req);
        const types = Object.keys(handlers);
        const requestedType = accept.type(...types);

        (handlers[requestedType] || app.error)(err, req, res);
      } else {
        let finalHandler;

        if (isFunction(handler)) {
          finalHandler = handler;
        } else if (isString(handler)) {
          finalHandler = handlers[handler]
            || handlers.html
            || defaultHandlers.html;
        } else {
          finalHandler = handlers.html || defaultHandlers.html;
        }

        finalHandler(err, req, res);
      }
    },
  };
};
