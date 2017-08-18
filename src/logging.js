// @flow
import chalk from 'chalk';
import finished from 'on-finished';
import tap from './tap';

import type {AppCreator} from './types';
import type {IncomingMessage, ServerResponse} from 'http';
type Logger = (req: IncomingMessage, res: ServerResponse) => void;

const identity = (x) => x;

export const consoleLogger = (x: string) => {
  console.log(x); // eslint-disable-line no-console
};

export const formatResponseTime = (
  reqTiming: ?Object,
  resTiming: ?Object,
): ?string => {
  if (
    reqTiming &&
    resTiming &&
    (typeof resTiming.headers === 'number') &&
    (typeof reqTiming.start === 'number')
  ) {
    const ms = (resTiming.headers - reqTiming.start) * 1e3;
    return `${ms.toFixed(3)}ms`;
  }
  return null;
};

export const formatStatusCode = (statusCode: number) => {
  /* eslint-disable no-nested-ternary */
  const color = statusCode >= 500 ? chalk.red // red
    : statusCode >= 400 ? chalk.yellow // yellow
      : statusCode >= 300 ? chalk.cyan // cyan
        : statusCode >= 200 ? chalk.green // green
          : identity; // no color
  /* eslint-enable no-nested-ternary */
  return color(statusCode);
};

// Since logging happens at the end of the request cycle, morgan does not need
// to install any of its own lifecycle hooks; therefore set the immediate flag.
export const dev = (writer: (string) => void) => (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const line = [
    formatStatusCode(req.statusCode),
    chalk.white(req.method),
    req.url,
    formatResponseTime(
      typeof req.timing === 'object' ? req.timing : null,
      typeof res.timing === 'object' ? res.timing : null
    ),
  ].filter(identity).join(' ');
  writer(line);
  if (req.error instanceof Error) {
    const error: Error = req.error;
    writer(`${chalk.red(error.message)}`);
    writer(error.stack);
  }
};

export default (
  logger: Logger = dev(consoleLogger)
): AppCreator => tap((req, res) => {
  // Wait until before headers are sent in order to capture everything
  // that's gone on with the request.
  finished(res, () => {
    logger(req, res);
  });
});
