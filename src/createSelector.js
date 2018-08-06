// @flow
import apply from './apply';
import type {App} from './types';

type CS<S> = {
  <R>(() => R): ((R) => S) => S,
  <R, V1>(((V1) => S) => S, (V1) => Promise<R> | R): ((R) => S) => S,
  <R, V1, V2>(
    ((V1) => S) => S,
    ((V2) => S) => S,
    (V1, V2) => Promise<R> | R,
  ): ((R) => S) => S,
  <R, V1, V2, V3>(
    ((V1) => S) => S,
    ((V2) => S) => S,
    ((V3) => S) => S,
    (V1, V2, V3) => Promise<R> | R,
  ): ((R) => S) => S,
  <R, V1, V2, V3, V4>(
    ((V1) => S) => S,
    ((V2) => S) => S,
    ((V3) => S) => S,
    ((V4) => S) => S,
    (V1, V2, V3, V4) => Promise<R> | R,
  ): ((R) => S) => S,
  <R, V1, V2, V3, V4, V5>(
    ((V1) => S) => S,
    ((V2) => S) => S,
    ((V3) => S) => S,
    ((V4) => S) => S,
    ((V5) => S) => S,
    (V1, V2, V3, V4, V5) => Promise<R> | R,
  ): ((R) => S) => S,
};

const createSelector: CS<App> = <R>(
  ...args: Array<*>
): (((R) => App) => App) => {
  const selectors = args.slice(0, args.length - 1);
  const selector = args[args.length - 1];
  const out = (cb: (R) => App | Promise<App>): App => {
    const next = async (...results): Promise<App> => {
      const result: R = await selector(...results);
      return await cb(result);
    };
    const result = apply(...selectors, next);
    return result;
  };
  out._selectors = selectors;
  out._selector = selector;
  return out;
};

export default createSelector;
