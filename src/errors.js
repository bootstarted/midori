// TODO.
/* eslint-disable no-console */
import chalk from 'chalk';

const simpleError = (err, req, res) => {
  const status = err.statusCode || err.status || 500;

  let message = '';
  let stack = '';

  console.log(
    `${chalk.bold.red(`Server error ${status}`)}\n
    ${chalk.red(err.message)}\n`,
    err.stack
  );

  if (process.env.NODE_ENV !== 'production') {
    message = `<h2>${err.message}</h2>`;
    stack = `\n<pre>\n${err.stack}\n</pre>`;
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
};

export default () => (app) => ({
  ...app,
  error: simpleError,
});
