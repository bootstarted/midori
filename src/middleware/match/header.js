import lowerCase from 'lodash/lowerCase';
import {guard, create} from './util';

export default (header, check) => {
  const g = guard(check);
  const v = lowerCase(header);
  return create((req) => {
    return g(req.headers[v]);
  });
};
