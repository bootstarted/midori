// @flow
import type {App, InternalInstance} from './types';
import pure from './pure';

type Cont<T> = (...rest: Array<*>) => T | Promise<T>;

const cache: WeakMap<*, WeakMap<*, *>> = new WeakMap();

const mapToCache = (item: *): WeakMap<*, *> => {
  if (cache.has(item)) {
    // TODO: https://github.com/facebook/flow/issues/2751
    // flowlint-next-line unclear-type: off
    return (cache.get(item): any);
  }
  const result: WeakMap<*, *> = new WeakMap();
  cache.set(item, result);
  return result;
};

type Callback<T> = ((T) => App) => App;

const baseApp = {
  request: /* istanbul ignore next */ (): void => {
    throw new Error();
  },
  upgrade: /* istanbul ignore next */ (): void => {
    throw new Error();
  },
  listening: /* istanbul ignore next */ (): void => {
    throw new Error();
  },
  close: /* istanbul ignore next */ (): void => {
    throw new Error();
  },
  error: /* istanbul ignore next */ (err): void => {
    throw err;
  },
  upgradeError: (err): void => {
    throw err;
  },
  requestError: (err): void => {
    throw err;
  },
};

const createHandler = (app, cont, appItems) => async (cache, handleApp) => {
  const results = [];
  for (const app of appItems) {
    if (cache.has(app)) {
      results.push(cache.get(app));
    } else {
      const result = handleApp(app);
      cache.set(app, result);
      results.push(result);
    }
  }
  const result = await Promise.all(results).then((x) => {
    return cont(...x);
  });
  return await handleApp(result(app));
};

const _apply = (cont: Cont<App>, rest: Array<Callback<*>>): App => {
  const appItems: Array<InternalInstance> = rest.map((item: Callback<*>) => {
    if (cache.has(item)) {
      // FIXME
      // $ExpectError
      return cache.get(item);
    }
    const app = item(pure)(baseApp);
    // FIXME
    // $ExpectError
    cache.set(item, app);
    return app;
  });

  return (app: InternalInstance): InternalInstance => {
    const handler = createHandler(app, cont, appItems);
    return {
      ...app,
      request: async (req, res) => {
        try {
          const cache: WeakMap<*, *> = mapToCache(req);
          return await handler(cache, async (app) => {
            return await app.request(req, res);
          });
        } catch (err) {
          return app.requestError(err, req, res);
        }
      },
      upgrade: async (req, socket, head) => {
        try {
          const cache: WeakMap<*, *> = mapToCache(socket);
          return await handler(cache, async (app) => {
            return app.upgrade(req, socket, head);
          });
        } catch (err) {
          return app.upgradeError(err, req, socket, head);
        }
      },
    };
  };
};

type Apply = {
  (() => App | Promise<App>): App,
  <V1>(Callback<V1>, (V1) => App | Promise<App>): App,
  <V1, V2>(Callback<V1>, Callback<V2>, (V1, V2) => App | Promise<App>): App,
  <V1, V2, V3>(
    Callback<V1>,
    Callback<V2>,
    Callback<V3>,
    (V1, V2, V3) => App | Promise<App>,
  ): App,
  <V1, V2, V3, V4>(
    Callback<V1>,
    Callback<V2>,
    Callback<V3>,
    Callback<V4>,
    (V1, V2, V3, V4) => App | Promise<App>,
  ): App,
};

/**
 * @desc
 * @tag core
 * @returns {App} New app.
 */
const apply: Apply = (...args): App => {
  // TODO: Any way to make this better?
  // flowlint-next-line unclear-type: off
  const rest: Array<Callback<*>> = (args.slice(0, args.length - 1): any);
  const cont = args[args.length - 1];
  const out = _apply(cont, rest);
  return out;
};

export default apply;
