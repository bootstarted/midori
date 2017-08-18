// @flow
import compression from 'compression';
import middleware from './middleware';

import type {AppCreator} from './types';

/**
 * Compress the response sent back to the client.
 * @param {?Object} options Compression options.
 * @returns {Function} App creator.
 */
export default (options: ?Object): AppCreator =>
  middleware(compression(options));
