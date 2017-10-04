// @flow
import baseApp from './internal/baseApp';
import validateApp from './internal/validateApp';

import {default as accepts} from './match/accepts';
import {default as header} from './match/header';
import {default as host} from './match/host';
import {default as method} from './match/method';
import {default as path} from './match/path';
import {default as protocol} from './match/protocol';
import {default as query} from './match/query';

import type {AppCreator, App} from './types';

/**
 * Branch between two app creators based on some given predicate.
 * @param {Function} match Predicate to match against.
 * @param {Function} yes App creator for when the predicate is true.
 * @param {Function} no App creator for when the predicate is false.
 * @returns {Function} App creator.
 */
export default function(
  match: AppCreator,
  yes: AppCreator,
  no: AppCreator = (x) => x
) {
  return function(initApp: ?App): App {
    const _app = {
      ...baseApp,
      ...initApp,
    };
    const app = match(_app);
    const yesApp = yes(app);
    const noApp = no(app);
    validateApp(app);
    return {
      ..._app,
      stack: [..._app.stack, {
        type: 'MATCH',
        predicate: app.stack.slice(_app.stack.length),
        yes: yesApp.stack.slice(app.stack.length),
        no: noApp.stack.slice(app.stack.length),
      }],
      request(req, res) {
        req.stack = this.stack;
        if (app.matches(req, res)) {
          yesApp.request(req, res);
        } else {
          noApp.request(req, res);
        }
      },
    };
  };
}

export {
  accepts,
  header,
  host,
  method,
  path,
  protocol,
  query,
};
