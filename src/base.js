import compose from 'lodash/function/compose';

import compression from './middleware/compression';
import cookies from './middleware/cookies';
import id from './middleware/id';
import locale from './middleware/locale';
import logging from './middleware/logging';
import secure from './middleware/secure';
import useragent from './middleware/useragent';

export default compose(
  compression,
  cookies,
  id,
  locale,
  logging,
  secure,
  useragent
);
