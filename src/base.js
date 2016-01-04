import compose from 'lodash/function/compose';

import compression from './middleware/compression';
import cookies from './middleware/cookies';
import empty from './middleware/empty';
import environment from './middleware/environment';
import graceful from './middleware/graceful';
import id from './middleware/id';
import locale from './middleware/locale';
import logging from './middleware/logging';
import secure from './middleware/secure';
import timing from './middleware/timing';
import useragent from './middleware/useragent';

export default function(options) {
  return compose(
    empty,
    graceful(),
    timing(),
    logging(options),
    secure(options),
    id(options),
    compression(options),
    cookies(options),
    environment(options),
    locale(options),
    useragent(options)
  );
}
