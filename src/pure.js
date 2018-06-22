// @flow
import type {App} from './types';

const pure = <T>(value: T): App => () => ({
  request: (): T => value,
  upgrade: (): T => value,
  listening: (): T => value,
  close: (): T => value,
  error: (): T => value,
  upgradeError: (): T => value,
  requestError: (): T => value,
});

export default pure;
