// @flow
import apply from './apply';
import type {App} from './types';

type AsyncApp = App | Promise<App>;
type AppFunction<T> = ((T) => AsyncApp) => App;

type CreateSelector = {
  <R>(() => Promise<R> | R): AppFunction<R>,
  <R, V1>(AppFunction<V1>, (V1) => Promise<R> | R): AppFunction<R>,
  <R, V1, V2>(
    AppFunction<V1>,
    AppFunction<V2>,
    (V1, V2) => Promise<R> | R,
  ): AppFunction<R>,
  <R, V1, V2, V3>(
    AppFunction<V1>,
    AppFunction<V2>,
    AppFunction<V3>,
    (V1, V2, V3) => Promise<R> | R,
  ): AppFunction<R>,
  <R, V1, V2, V3, V4>(
    AppFunction<V1>,
    AppFunction<V2>,
    AppFunction<V3>,
    AppFunction<V4>,
    (V1, V2, V3, V4) => Promise<R> | R,
  ): AppFunction<R>,
  <R, V1, V2, V3, V4, V5>(
    AppFunction<V1>,
    AppFunction<V2>,
    AppFunction<V3>,
    AppFunction<V4>,
    AppFunction<V5>,
    (V1, V2, V3, V4, V5) => Promise<R> | R,
  ): AppFunction<R>,
  <R, V1, V2, V3, V4, V5, V6>(
    AppFunction<V1>,
    AppFunction<V2>,
    AppFunction<V3>,
    AppFunction<V4>,
    AppFunction<V5>,
    AppFunction<V6>,
    (V1, V2, V3, V4, V5, V6) => Promise<R> | R,
  ): AppFunction<R>,
  <R, V1, V2, V3, V4, V5, V6, V7>(
    AppFunction<V1>,
    AppFunction<V2>,
    AppFunction<V3>,
    AppFunction<V4>,
    AppFunction<V5>,
    AppFunction<V6>,
    AppFunction<V7>,
    (V1, V2, V3, V4, V5, V6, V7) => Promise<R> | R,
  ): AppFunction<R>,
  <R, V1, V2, V3, V4, V5, V6, V7, V8>(
    AppFunction<V1>,
    AppFunction<V2>,
    AppFunction<V3>,
    AppFunction<V4>,
    AppFunction<V5>,
    AppFunction<V6>,
    AppFunction<V7>,
    AppFunction<V8>,
    (V1, V2, V3, V4, V5, V6, V7, V8) => Promise<R> | R,
  ): AppFunction<R>,
  <R, V1, V2, V3, V4, V5, V6, V7, V8, V9>(
    AppFunction<V1>,
    AppFunction<V2>,
    AppFunction<V3>,
    AppFunction<V4>,
    AppFunction<V5>,
    AppFunction<V6>,
    AppFunction<V7>,
    AppFunction<V8>,
    AppFunction<V9>,
    (V1, V2, V3, V4, V5, V6, V7, V8, V9) => Promise<R> | R,
  ): AppFunction<R>,
};

const createSelector: CreateSelector = (...args) => {
  const selectors = args.slice(0, args.length - 1);
  const selector = args[args.length - 1];
  const out = (cb): App => {
    const next = async (...results): Promise<App> => {
      // TODO: FIXME: Welp
      // $ExpectError
      const result = await selector(...results);
      // TODO: FIXME: Welp
      // $ExpectError
      return await cb(result);
    };
    // TODO: FIXME: Welp
    // $ExpectError
    const result = apply(...selectors, next);
    return result;
  };
  out._selectors = selectors;
  out._selector = selector;
  return out;
};

export default createSelector;
