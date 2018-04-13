// @flow
import url from './url';
import createSelector from './createSelector';
import qs from 'qs';

import type {ParseOptions} from 'qs';

export const withOptions = (opts?: ParseOptions) => {
  return createSelector(url, (url) => {
    return qs.parse(url.search, opts);
  });
};

export default withOptions();
