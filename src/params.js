// @flow
import request from './request';
import createSelector from './createSelector';
import {params} from './match/path';

export default createSelector(
  request,
  (req): {[string]: string} => {
    return params.get(req) || {};
  },
);
