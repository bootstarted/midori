/* global BUILD_VERSION BUILD_COMMIT */

import { hostname } from 'os';

export default function() {
  return function(next) {
    return function(req, res) {
      // Set any specific information about your environment here.
      // NOTE: These are server-side specific environment properties; nothing
      // that comes from the client should be in this object.
      req.environment = {
        version: BUILD_VERSION,
        commit: BUILD_COMMIT,
        hostname: hostname(),
        env: process.env.NODE_ENV,
      };

      // Expose useful information to the client that they might want when
      // calling via HEAD or similar.
      res.setHeader('Version', BUILD_VERSION);
      res.setHeader('Commit', BUILD_COMMIT);

      // Carry on.
      next(req, res);
    };
  };
}
