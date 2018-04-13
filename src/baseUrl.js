// @flow
import request from './request';
import createSelector from './createSelector';
import {baseUrl} from './match/path';

export default createSelector(
  request,
  (req): string => {
    return baseUrl.get(req) || '';
  },
);
