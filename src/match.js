// @flow
import baseApp from './internal/baseApp';

import type {MatchCreator, AppCreator, App} from './types';

/**
 * Branch between two app creators based on some given predicate.
 * @param {Function} createMatch Predicate to match against.
 * @param {Function} yes App creator for when the predicate is true.
 * @param {Function} no App creator for when the predicate is false.
 * @returns {Function} App creator.
 */
export default function(
  createMatch: MatchCreator,
  yes: AppCreator,
  no: AppCreator = (x) => x
) {
  return function(initApp: ?App): App {
    const _app = {
      ...baseApp,
      ...initApp,
    };
    const match = createMatch(_app);
    const yesApp = yes(match.app);
    const noApp = no(match.app);
    return {
      ..._app,
      upgrade(req, socket, head) {
        const result = match.matches(req);
        if (result) {
          yesApp.upgrade(req, socket, head);
        } else {
          noApp.upgrade(req, socket, head);
        }
      },
      request(req, res) {
        const result = match.matches(req);
        if (result) {
          yesApp.request(req, res);
        } else {
          noApp.request(req, res);
        }
      },
    };
  };
}

export {default as header} from './match/header';
export {default as host} from './match/host';
export {default as method} from './match/method';
export {default as path} from './match/path';
export {default as protocol} from './match/protocol';
export {default as query} from './match/query';
