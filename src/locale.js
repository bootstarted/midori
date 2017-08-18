// @flow
import detect from 'negotiator/lib/language';
import request from './request';
import update from './assign';

import type {AppCreator} from './types';
type Options = {locales: Array<string>}

/**
 * Detect current locales.
 * @param {Object} options Configuration options.
 * @returns {Function} App creator.
 */
export default (options: Options): AppCreator => request((req) => {
  const {locales: allowed} = options;
  const locales = detect(req.headers['accept-language'], allowed);
  const locale = locales[0];
  return update({locale, locales}, null);
});
