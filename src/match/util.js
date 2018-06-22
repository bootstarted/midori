// @flow
import type {Match, Matches, MatchCreator} from '../types';

export const create = (matches: Matches): MatchCreator => (app): Match => {
  return {
    app,
    matches,
  };
};

type _Predicate<T> = string | RegExp | ((x: T) => boolean);

export type Predicate<T> = _Predicate<T> | Array<_Predicate<T>>;

export const guard = <T>(hosts: Predicate<T>): ((T) => boolean) => {
  if (hosts instanceof RegExp) {
    // TODO: FIXME: Flow requires this assignment.
    const pattern: RegExp = hosts;
    return (val) => typeof val === 'string' && !!pattern.exec(val);
  } else if (typeof hosts === 'string') {
    return (val) => val === hosts;
  } else if (Array.isArray(hosts)) {
    const guards = hosts.map(guard);
    return (val) => guards.some((x) => x(val));
  } else if (typeof hosts === 'function') {
    const fn: (x: T) => boolean = hosts;
    return fn;
  }
  throw new TypeError();
};
