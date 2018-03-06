// @flow
import request from './request';
import error from './error';
import pure from './pure';
import next from './next';

import type {IncomingMessage, ServerResponse} from 'http';
import type {AppCreator} from './types';

type Callback = (err: ?Error) => void;
type BasicHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => void;
type CallbackHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  next: Callback,
) => void
type ErrorHandler = (
  err: Error,
  req: IncomingMessage,
  res: ServerResponse,
  next: Callback,
) => void;
type Handler = BasicHandler & CallbackHandler & ErrorHandler;

const handleBasic = (handler: BasicHandler) => {
  return request((req: IncomingMessage, res: ServerResponse) => {
    handler(req, res);
    return pure();
  });
};

const handleCallback = (handler: CallbackHandler) => {
  return request((req: IncomingMessage, res: ServerResponse) => {
    return new Promise((resolve, reject) => {
      handler(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(next);
      });
    });
  });
};

const handleError = (handler: ErrorHandler) => {
  return error((err: Error, req: IncomingMessage, res: ServerResponse) => {
    return new Promise((resolve, reject) => {
      handler(err, req, res, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(next);
      });
    });
  });
};

/**
 * Handle express-style middleware.
 * @param {Function} handler Express-style middleware.
 * @returns {Function} Result.
 */
export default (handler: Handler): AppCreator => {
  if (handler.length === 2) {
    return handleBasic((handler: BasicHandler));
  } else if (handler.length === 3) {
    return handleCallback((handler: CallbackHandler));
  } else if (handler.length === 4) {
    return handleError((handler: ErrorHandler));
  }
  throw new TypeError();
};
