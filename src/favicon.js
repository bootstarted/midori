// @flow
import {readFileSync} from 'fs';
import send from './send';
import header from './header';
import use from './use';

import type {AppCreator} from './types';

export default (favicon: string): AppCreator => {
  const data = readFileSync(favicon);
  return use(
    '/favicon.ico',
    header('Content-Type', 'image/x-icon'),
    header('Content-Length', data.length.toString()),
    send(data),
  );
};
