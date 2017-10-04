// @flow
import match from './match';
import path from './match/path';
import compose from './compose';

import type {AppCreator} from './types';

export default (url: string, ...rest: Array<AppCreator>): AppCreator =>
  match(path(url), compose(...rest));
