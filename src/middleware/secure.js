import identity from 'lodash/identity';
import compose from 'lodash/flowRight';

import header from './header';
/**
 * [function description]
 * @param {Boolean} secure True to enable security features.
 * @returns {Function} Middleware function.
 */
export default ({
  secure = process.env.NODE_ENV === 'production',
} = {}) => {
  if (!secure) {
    return identity;
  }

  return compose(
    // https://www.owasp.org/index.php/List_of_useful_HTTP_headers
    header.strictTransportSecurity('max-age=16070400'),
    header.xFrameOptions('deny'),
    header.xXssProtection('1; mode=block'),
    header.xDownloadOptions('noopen'),
    header.xContentTypeOptions('nosniff'),
    // header.publicKeyPins('...');
  );
};
