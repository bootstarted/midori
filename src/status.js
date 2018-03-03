// @flow
import request from './request';
import next from './next';

import type {AppCreator} from './types';

/**
 * Set the HTTP status code for the response.
 * @param {Number} statusCode The status code to set.
 * @returns {Function} App creator.
 */
const status = (statusCode: number): AppCreator => {
  return request((req, res) => {
    res.statusCode = statusCode;
    return next;
  });
};

export default status;
