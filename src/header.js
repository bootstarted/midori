// @flow
import next from './next';
import response from './response';

import type {App} from './types';

/**
 * Set an HTTP response header.
 * @param {String} name Name of the header to set.
 * @param {String} value Value to set the header to.
 * @returns {App} App instance.
 */
const header = (name: string, value: string): App => {
  return response((res) => {
    res.setHeader(name, value);
    return next;
  });
};

export default header;
