// @flow
/* eslint-disable no-console */
/* global console process */

import pure from '../pure';
import {isProduction} from './environment';

const getStatusCode = (err: Error): number => {
  if (typeof err.statusCode === 'number') {
    return err.statusCode;
  } else if (typeof err.status === 'number') {
    return err.status;
  }
  return 500;
};

type BaseRequest = {

};
type BaseResponse = {
  headersSent: boolean,
  finished: boolean,
  statusCode: number,
  +setHeader: (string, string) => void,
  +end: (string) => void,
}

const errorHandler = <Req: BaseRequest, Res: BaseResponse>(
  err: Error,
  req: Req,
  res: Res,
) => {
  const status: number = getStatusCode(err);

  let message = '';
  let stack = '';

  if (!isProduction()) {
    message = `<h2>${err.message}</h2>`;
    stack = `\n<pre>\n${err.stack}\n</pre>`;
  }

  if (!req || !res) {
    console.error('Error not associated with any request.');
    console.error('You should restart the server.');
    console.error(err);
    return pure(err);
  }

  if (res.headersSent || (typeof res.socket !== 'object') || res.finished) {
    console.error('Error occured after response already delivered.');
    console.error('This probably indicates a problem elsewhere.');
    console.error(err);
    return pure(err);
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
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(body);

  return pure(err);
};

export default errorHandler;
