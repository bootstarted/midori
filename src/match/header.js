// @flow
import {guard, create} from './util';
import type {Predicate} from './util';

export default (header: string, check: Predicate<string>) => {
  const g = guard(check);
  const v = header.toLowerCase();
  return create((req) => {
    return g(req.headers[v]);
  });
};
