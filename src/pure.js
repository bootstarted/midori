// @flow
import type {App, AppCreator} from './types';

const pure = <T>(value: T): AppCreator => (app: App): App => ({
  ...app,
  request: (): T => value,
});

export default pure;
