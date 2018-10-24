// @flow
import url from 'parseurl';
import {parse} from 'qs';
import {create} from './util';

type Predicate =
  | {[string]: Predicate}
  | Array<Predicate>
  | string
  | number
  | boolean;

const isMatch = (pred: Predicate, obj: mixed) => {
  if (Array.isArray(obj)) {
    return obj.some((x) => isMatch(pred, x));
  } else if (Array.isArray(pred)) {
    return pred.some((x) => isMatch(x, obj));
  } else if (typeof pred === 'object') {
    // TODO: FIXME: Flow requires this assignment.
    if (typeof obj === 'object' && obj !== null) {
      const realObj = (obj: {[string]: mixed});
      const index: {[string]: Predicate} = pred;
      return Object.keys(pred).every((key) => {
        return isMatch(index[key], realObj[key]);
      });
    }
    return false;
  }
  return pred === obj;
};

export default (query: Predicate) =>
  create((req) => {
    const parts = url(req);
    if (!parts.search) {
      return isMatch(query, {});
    }
    return isMatch(query, parse(parts.search.substr(1)));
  });
