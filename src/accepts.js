// @flow
import Negotiator from 'negotiator';
import request from './request';
import update from './assign';

import type {AppCreator} from './types';

export default (allowed: Array<string> = ['*/*']): AppCreator =>
  request((req) => {
    const negotiator: Negotiator = req.negotiator || new Negotiator(req);
    return update({
      negotiator,
      type: negotiator.mediaType(allowed),
    }, null);
  });
