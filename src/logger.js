// @flow
import chalk from 'chalk';
import request from './request';
import response from './response';
import apply from './apply';
import timing from './timing';
import pure from './pure';

import type {InternalInstance} from './types';

type Console = {
  +log: (x: string) => void,
};

const identity = (x) => x;

let consoleObject: Console = console;

export const setConsole = (c: Console) => (consoleObject = c);

export const formatResponseTime = (duration: ?number): ?string => {
  if (typeof duration === 'number') {
    return `${duration.toFixed(3)}ms`;
  }
  return null;
};

const codeColors = [
  [100, chalk.white],
  [200, chalk.green],
  [300, chalk.cyan],
  [400, chalk.yellow],
  [500, chalk.red],
];

export const formatStatusCode = (statusCode: number) => {
  const color = codeColors.reduce((color, [value, newColor]) => {
    if (statusCode >= value) {
      return newColor;
    }
    return color;
  }, identity);
  return color(statusCode);
};

const logger = (app: InternalInstance) => {
  return apply(
    request,
    response,
    timing.headers,
    // FIXME: This is kind of a hack for being able put the logger at the start
    // of the compose declaration but have it resolve _AFTER_ the entire app.
    (_fn) => (_p) => {
      return app;
    },
    (req, res, timing, x) => {
      const line = [
        formatStatusCode(res.statusCode),
        chalk.white(req.method),
        req.url,
        formatResponseTime(timing),
      ]
        .filter(identity)
        .join(' ');
      consoleObject.log(line);
      return pure(x);
    },
  )(app);
};

export default logger;
