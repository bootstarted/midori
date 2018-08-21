// @flow
import url from './url';
import createSelector from './createSelector';
import qs from 'qs';

import type {ParseOptions} from 'qs';
type QueryResult = {[string]: Array<QueryResult> | string};

export const withOptions = (opts?: ParseOptions) => {
  return createSelector(
    url,
    (url): QueryResult => {
      if (!url.search) {
        return {};
      }
      return qs.parse(url.search.substr(1), opts);
    },
  );
};

export default withOptions();
