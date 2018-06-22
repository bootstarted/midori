// @flow
import compose from './compose';
import method from './match/method';
import path from './match/path';
import every from './match/every';
import match from './match';

import type {App} from './types';

const verb = (verb: string) => (
  prefix: string,
  ...middleware: Array<App>
): App => match(every(method(verb), path(prefix)), compose(...middleware));

export const del = verb('DELETE');
export const get = verb('GET');
export const post = verb('POST');
export const head = verb('HEAD');
export const put = verb('PUT');
export const patch = verb('PATCH');
