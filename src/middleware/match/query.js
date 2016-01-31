import isMatch from 'lodash/isMatch';
import url from 'parseurl';
import { parse } from 'qs';
import {create} from './util';

export default (query) => create((req) => {
  return isMatch(parse(url(req).query), query);
});
