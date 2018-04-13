// @flow
import request from './request';
import createSelector from './createSelector';
import url from 'parseurl';

import type {IncomingMessage} from 'http';

export default createSelector(
  request,
  (req: IncomingMessage): URL => {
    return url(req);
  },
);
