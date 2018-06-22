// @flow
import {guard, create} from './util';
import type {Predicate} from './util';

// TODO: Add complete list of methods somewhere.
type Method = 'GET' | 'PUT' | 'POST' | string;

export default (method: Predicate<Method>) => {
  const g = guard(method);
  return create((req) => {
    return g(req.method);
  });
};
