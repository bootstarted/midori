// @flow
import apply from './apply';
import request from './request';
import response from './response';
import error from './error';
import next from './next';

import type {IncomingMessage, ServerResponse} from 'http';
import type {App} from './types';

type Callback = (err: ?Error) => void;
type BasicHandler = (req: IncomingMessage, res: ServerResponse) => void;
type CallbackHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  next: Callback,
) => void;
type ErrorHandler = (
  err: Error,
  req: IncomingMessage,
  res: ServerResponse,
  next: Callback,
) => void;
type Handler = BasicHandler & CallbackHandler & ErrorHandler;

const handleBasic = (handler: BasicHandler) => {
  return (app) => ({
    ...app,
    request: async (req, res) => {
      try {
        handler(req, res);
        return null;
      } catch (err) {
        return await app.requestError(err, req, res);
      }
    },
  });
};

const handleCallback = (handler: CallbackHandler) => {
  return (app) => ({
    ...app,
    request: async (req, res) => {
      try {
        await new Promise((resolve, reject) => {
          handler(req, res, (err) => {
            err ? reject(err) : resolve();
          });
        });
        return await app.request(req, res);
      } catch (err) {
        return await app.requestError(err, req, res);
      }
    },
  });
};

const handleError = (handler: ErrorHandler) => {
  return error((err: Error) => {
    return apply(request, response, (req, res) => {
      return new Promise((resolve, reject) => {
        handler(err, req, res, (err) => {
          if (err) {
            return reject(err);
          }
          return resolve(next);
        });
      });
    });
  });
};

/**
 * Handle express-style middleware.
 * @param {Function} handler Express-style middleware.
 * @returns {App} App instance.
 */
export default (handler: Handler): App => {
  if (handler.length === 2) {
    return handleBasic((handler: BasicHandler));
  } else if (handler.length === 3) {
    return handleCallback((handler: CallbackHandler));
  } else if (handler.length === 4) {
    return handleError((handler: ErrorHandler));
  }
  throw new TypeError();
};
