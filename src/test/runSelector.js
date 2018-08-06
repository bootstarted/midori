// @flow
import isSelector from '../internal/isSelector';
import type {App} from '../types';

class MockEnvironment {
  values: Map<mixed, mixed>;
  constructor() {
    this.values = new Map();
  }
  mockValue(selector, value) {
    this.values.set(selector, value);
  }
  hasValueFor(selector) {
    return this.values.has(selector);
  }
  valueFor(selector) {
    return this.values.get(selector);
  }
}

const runSelectorInternal = async <T>(
  app: ((T) => App) => App,
  env: MockEnvironment,
): Promise<T> => {
  if (isSelector(app)) {
    if (env.hasValueFor(app)) {
      // flowlint-next-line unclear-type: off
      return (env.valueFor(app): any);
    }
    const args = [];
    for (const selectorApp of app._selectors) {
      args.push(await runSelectorInternal(selectorApp, env));
    }

    const result = await app._selector(...args);
    env.mockValue(app, result);
    return result;
  }
  throw new TypeError('Must pass valid selector.');
};

const runSelector = async <T>(
  app: ((T) => App) => App,
  fn: (env: MockEnvironment) => void = () => {},
): Promise<T> => {
  const env = new MockEnvironment();
  fn(env);
  return await runSelectorInternal(app, env);
};

export default runSelector;
