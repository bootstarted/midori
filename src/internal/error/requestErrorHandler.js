// @flow
/* eslint-disable no-console */
/* global console process */

import {isProduction} from '../environment';
import type {IncomingMessage, ServerResponse} from 'http';

declare class ErrorWithStatusCode extends Error {
  status?: number;
  statusCode?: number;
}

const getStatusCode = (err: ErrorWithStatusCode | Error): number => {
  if (typeof err.statusCode === 'number') {
    return err.statusCode;
  } else if (typeof err.status === 'number') {
    return err.status;
  }
  return 500;
};

export const createRequestErrorHandler = (console: typeof console) => (
  err: Error,
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const status: number = getStatusCode(err);

  let message = '';
  let stack = '';

  if (!isProduction()) {
    message = `<h2>${err.message}</h2>`;
    stack = `\n<pre>\n${err.stack}\n</pre>`;
  }

  if (res.headersSent || res.finished) {
    console.error('Error occured after response already delivered.');
    console.error('This probably indicates a problem elsewhere.');
    console.error(err);
    return;
  }

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
</body>
</html>`;

  res.statusCode = status;
  res.setHeader('Connection', 'close');
  res.setHeader('Content-Length', `${Buffer.byteLength(body, 'utf8')}`);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(body);
};

const requestErrorHandler = createRequestErrorHandler(console);

export default requestErrorHandler;
