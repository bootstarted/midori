import compose from 'lodash/function/compose';

import compression from './middleware/compression';
import cookies from './middleware/cookies';
import environment from './middleware/environment';
import id from './middleware/id';
import locale from './middleware/locale';
import logging from './middleware/logging';
import secure from './middleware/secure';
import useragent from './middleware/useragent';

export default function(options) {
  return compose(
    compression(options),
    cookies(options),
    environment(options),
    id(options),
    locale(options),
    logging(options),
    secure(options),
    useragent(options)
  );
}
