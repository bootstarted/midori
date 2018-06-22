// @flow
import match from './match';
import path from './match/path';
import compose from './compose';

import type {App} from './types';

/**
 * Functional equivalent to express's `.use`. Supply a path and an app!
 * @param {String} url Mount path.
 * @param {Array<App>} rest Apps to call in sequence when matching the url.
 * @returns {App} App instance.
 */
export default (url: string, ...rest: Array<App>): App =>
  match(path(url), compose(...rest));
