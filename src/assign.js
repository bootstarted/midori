// @flow

import type {IncomingMessage, ServerResponse} from 'http';
import type {App} from './types';

/**
 * Attach custom values to the request/response objects.
 * @param {?Object} reqV Values to assign to the request.
 * @param {?Object} resV Values to assign to the response.
 * @returns {Function} App creator.
 */
const assign = (reqV: ?Object, resV: ?Object) => (app: App): App => {
  // We can never truly "replace" req/res since they're instance objects that
  // node provides. For something that was an actual functional programming
  // system we would be creating new objects here instead of assigning them.
  return {
    ...app,
    request(req: IncomingMessage, res: ServerResponse) {
      return app.request(
        Object.assign(req, reqV),
        Object.assign(res, resV),
      );
    },
  };
};

export default assign;
