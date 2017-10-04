import url from 'parseurl';
import {parse} from 'qs';
import {create} from './util';

const isMatch = (pred, obj) => {
  if (Array.isArray(obj)) {
    return obj.some((x) => isMatch(pred, x));
  } else if (Array.isArray(pred)) {
    return pred.some((x) => isMatch(x, obj));
  } else if (typeof pred === 'object') {
    return Object.keys(pred).every((key) => {
      return isMatch(pred[key], obj[key]);
    });
  }
  return pred === obj;
};

export default (query) => create((req) => (
  isMatch(query, parse(url(req).query))
));
