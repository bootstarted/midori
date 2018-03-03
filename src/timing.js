// @flow
import headers from 'on-headers';
import finished from 'on-finished';
import request from './request';
import update from './assign';

import type {AppCreator} from './types';

export type ResponseTiming = {
  headers?: number,
  end?: number,
  start?: number,
};
export type RequestTiming = {
  start?: number,
  end?: number,
};

/**
 * Get the current timestamp in seconds.
 * @returns {Number} Timestamp.
 */
function stamp() {
  const time = process.hrtime();
  return time[0] + time[1] * 1e-9;
}

/**
 * Attach timing information to the HTTP request and response objects. Note that
 * to use the timing results this function has to be called first in the
 * middleware chain.
 * @returns {Function} Middleware function.
 */
export default (): AppCreator => request((req, res) => {
  const reqTiming: RequestTiming = {};
  const resTiming: ResponseTiming = {};
  reqTiming.start = stamp();
  finished(req, () => {
    reqTiming.end = stamp();
  });
  headers(res, () => {
    resTiming.headers = stamp();
  });
  finished(res, () => {
    resTiming.end = stamp();
  });
  return update({timing: reqTiming}, {timing: resTiming});
});
