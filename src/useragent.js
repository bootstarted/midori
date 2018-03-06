// @flow
// flowlint untyped-import: off
import {lookup} from 'useragent';
// flowlint untyped-import: error
import request from './request';
import update from './assign';

import type {AppCreator} from './types';

declare class OS {
  toString(): string;
  toVersion(): string;
  toJSON(): string;
}

declare class Device {
  toString(): string;
  toVersion(): string;
  toJSON(): string;
}

declare class Agent {
  toAgent(): string;
  toString(): string;
  toVersion(): string;
  toJSON(): string;
  os: OS;
  family: string;
  major: number;
  minor: number;
  patch: number;
}

/**
 * Attach an `agent` property to the request containing useragent information.
 * @returns {Function} Middleware function.
 */
export default (): AppCreator => request((req) => {
  const agent: Agent = lookup(req.headers['user-agent']);
  return update({agent}, null);
});
