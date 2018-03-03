// @flow
import compose from './compose';
import next from './next';
import request from './request';
import match from './match';
import protocol from './match/protocol';
import redirect from './redirect';

import type {AppCreator} from './types';

/**
 * Enable security related functionality.
 * @returns {Function} Middleware function.
 */
export default (): AppCreator => compose(
  // Ensure app is served over HTTPS.
  match(protocol('https'), next, request((req) => {
    return redirect(`https://${req.headers.host}${req.url}`);
  })),
  // Send useful security headers for the browser.
  request((req, res) => {
    // https://www.owasp.org/index.php/List_of_useful_HTTP_headers
    res.setHeader('Strict-Transport-Security', 'max-age=16070400');
    res.setHeader('X-Frame-Options', 'deny');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return next;
  })
);
