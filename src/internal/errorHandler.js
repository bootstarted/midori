/* eslint-disable no-console */
/* global console process */

import pure from '../pure';
import {isProduction} from './environment';

const errorHandler = (err, req, res) => {
  const status = err.statusCode || err.status || 500;

  let message = '';
  let stack = '';

  if (!isProduction()) {
    message = `<h2>${err.message}</h2>`;
    stack = `\n<pre>\n${err.stack}\n</pre>`;
  }

  if (!req || !res) {
    console.log('Error not associated with any request.');
    console.log('You should restart the server.');
    return pure(err);
  }

  if (res.headersSent || !res.socket || res.finished) {
    console.log('Error occured after response already delivered.');
    console.log('This probably indicates a problem elsewhere.');
    console.log(err.stack);
    return pure(err);
  }

  req.error = err;

  const body = `
<!DOCTYPE html>
<html>
<head>
<title>Error ${status}</title>
<style>
body{font-family: sans-serif; color: #333}
</style>
</head>
<body>
<h1>Error ${status}</h1>
${message}${stack}
<br/>
<br/>
<pre>
${JSON.stringify(req.stack, null, 2)}
</pre>
</body>
</html>`;

  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(body);

  return pure(err);
};

export default errorHandler;
