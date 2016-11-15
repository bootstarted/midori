import { hostname } from 'os';

function detectVersion() {

}

function detectCommit() {

}

export default function({ environment: x } = { }) {
  const environment = {
    version: detectVersion(),
    commit: detectCommit(),
    hostname: hostname(),
    env: process.env.NODE_ENV,
    ...x,
  };

  return function(app) {
    const { request } = app;
    return {
      ...app,
      request(req, res) {
        // Set any specific information about your environment here.
        // NOTE: These are server-side specific environment properties; nothing
        // that comes from the client should be in this object.
        req.environment = environment;

        // Expose useful information to the client that they might want when
        // calling via HEAD or similar.
        if (environment.version) {
          res.setHeader('Version', environment.version);
        }
        if (environment.commit) {
          res.setHeader('Commit', environment.commit);
        }

        // Carry on.
        request(req, res);
      },
    };
  };
}
