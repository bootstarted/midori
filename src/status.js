// @flow
import response from './response';
import next from './next';

import type {App} from './types';

/**
 * Set the HTTP status code for the response.
 * @param {Number} statusCode The status code to set.
 * @returns {App} App instance.
 */
const status = (statusCode: number): App => {
  return response((res) => {
    res.statusCode = statusCode;
    return next;
  });
};

export default status;
