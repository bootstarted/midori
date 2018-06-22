// @flow
import type {MatchCreator, App} from './types';

/**
 * Branch between two apps based on some given predicate.
 * @param {Function} createMatch Predicate to match against.
 * @param {Function} yes App for when the predicate is true.
 * @param {Function} no App for when the predicate is false.
 * @returns {APp} App instance.
 */
export default function(
  createMatch: MatchCreator,
  yes: App,
  no: App = (x) => x,
): App {
  return function(app) {
    const match = createMatch(app);
    const yesApp = yes(match.app);
    const noApp = no(match.app);
    return {
      ...app,
      upgrade: async (req, socket, head) => {
        const result = await match.matches(req);
        if (result) {
          return await yesApp.upgrade(req, socket, head);
        }
        return await noApp.upgrade(req, socket, head);
      },
      request: async (req, res) => {
        const result = await match.matches(req);
        if (result) {
          return await yesApp.request(req, res);
        }
        return await noApp.request(req, res);
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
