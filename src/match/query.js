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

const isMatch = (pred: Predicate, obj: *) => {
  if (Array.isArray(obj)) {
    return obj.some((x) => isMatch(pred, x));
  } else if (Array.isArray(pred)) {
    return pred.some((x) => isMatch(x, obj));
  } else if (typeof pred === 'object') {
    // TODO: FIXME: Flow requires this assignment.
    const index: {[string]: Predicate} = pred;
    return Object.keys(pred).every((key) => {
      return isMatch(index[key], obj[key]);
    });
  }
  return pred === obj;
};

export default (query: Predicate) =>
  create((req) => isMatch(query, parse(url(req).search)));
