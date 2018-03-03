// @flow
import next from './next';
import request from './request';

import type {AppCreator} from './types';

/**
 * Set an HTTP response header.
 * @param {String} name Name of the header to set.
 * @param {String} value Value to set the header to.
 * @returns {Function} App creator.
 */
const header = (name: string, value: string): AppCreator => {
  return request((req, res) => {
    res.setHeader(name, value);
    return next;
  });
};

export default header;
