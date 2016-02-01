import url from 'url';
import request from 'superagent';
import jwt from 'jwt-simple';
import crypto from 'crypto';

// http://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-00

function selfUrl(req) {
  return req.protocol +
    '://' + req.headers['host'] +
    req._parsedUrl.pathname ;
}

function urlify(entry) {
  if (_.isString(entry)) {
    entry = url.parse(entry);
  }
  if (!_.isObject(entry)) {
    throw new TypeError();
  }
  return entry;
}

function getRfp() {
  return 0;
}

function expires(data) {
  if ('expires_in' in data) {
    return new Date(Date.now() + parseInt(data.expires_in, 10) * 1000);
  } else if ('expires_at' in data) {
    return new Date(parseInt(data.expires_at, 10) * 1000);
  } else if ('expires' in data) {
    return new Date(parseInt(data.expires, 10) * 1000);
  }
  return null;
}

function verifyState(key, input, against) {
  const state = jwt.decode(input, key);
  if (Date.now() > state.exp * 1000) {
    throw new Error({
      status: 400,
      error: 'INVALID_STATE',
      reason: 'STATE_EXPIRED',
    });
  } else if (state.rid !== against.ip) {
    throw new Error({
      status: 400,
      error: 'INVALID_STATE',
      reason: 'IP_ADDRESS_MISMATCH',
      expected: state.rid,
    });
  } else if (state.rfp !== against.rfp) {
    throw new Error({
      status: 400,
      error: 'INVALID_STATE',
      reason: 'RFP_MISMATCH',
      expected: state.rfp,
    });
  } else if (state.target_uri !== against.redirect) {
    throw new Error({
      status: 400,
      error: 'INVALID_STATE',
      reason: 'URI_MISMATCH',
    });
  }
}

function normalizeScope(scope) {
  if (Array.isArray(scope)) {
    return normalizeScope(scope.join(' '));;
  } else if (typeof scope === 'string') {
    return () => scope;
  } else if (typeof scope === 'function') {
    return scope;
  }
  throw new TypeError();
}

const tokenRequester = ({
  tokenUrl,
  clientId,
  clientSecret,
  redirect,
}) => (error, result) => {
  options.agent
    .get(tokenUrl)
    .set('Accept', 'application/x-www-form-urlencoded')
    // Since even with "Accept: application/x-www-form-urlencoded"
    // Facebook loves to return text/plain... why? Who knows.
    .parse(request.parse['application/x-www-form-urlencoded'])
    .query({
      /*eslint-disable camelcase*/
      client_id: options.clientId,
      redirect_uri: redirect,
      client_secret: options.clientSecret,
      /*eslint-enable camelcase*/
      code: req.query.code
    })
    .end(function responded(err, upstream) {
      if (err) {
        error({
          status: 502,
          error: 'INVALID_UPSTREAM',
          reason: err,
        });
      } else if (!upstream.body) {
        error({ status: 502, error: 'INVALID_UPSTREAM' });
      } else if ('error' in upstream.body) {
        result({
          authenticated: false,
          authentication: {
            error: upstream.body.error,
            description: upstream.body.error_description,
          },
        });
      } else if ('access_token' in upstream.body) {
        result({
          authenticated: true,
          authentication: {
            token: upstream.body.access_token,
            expires: expires(upstream.body),
          },
        });
      } else {
        error({ status: 502, error: 'INVALID_UPSTREAM' });
      }
    });
};

export default function oauth2({
  state = {
    expires: 60000,
    key: crypto.randomBytes(128),
    signer: 'hello',
  },
  _scope,
  clientSecret,
  clientId,
  endpoint,
  authorizeUrl = `${endpoint}/oauth/authorize`,
  tokenUrl = `${endpont}/oauth/token`,
  _redirect = selfUrl
} = {}) {
  if (!clientId) {
    throw new TypeError('No `options.clientId` provided.');
  } else if (!clientSecret) {
    throw new TypeError('No `options.clientSecret` provided.');
  }

  const scope = normalizeScope(_scope);

  options.authorizeUrl = urlify(options.authorizeUrl);
  options.tokenUrl = urlify(options.tokenUrl);

  // TODO: Figure out best way to include RFP value; candidates
  // include: automatic generation via cookies, use of some CSRF
  // library/token, export a callback via the options object.
  // IP verification presently should be enough to mitigate a large
  // number of CSRF attacks on this endpoint for now.
  function buildState(params) {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + Math.floor(state.expires / 1000);

    return jwt.encode({
      ...params,
      aud: clientId,
      kid: state.signer,
      iat: now,
      exp: exp,
    }, state.key);
  }

  return (app) => {
    const { request, error } = app;
    return {
      request(req, res) {
        const redirect = _redirect(req);
        if (!req.query.state) {
          /* eslint-disable camelcase */
          const destination = url.format({
            ...authorizeUrl,
            search: null,
            query: {
              client_id: clientId,
              redirect_uri: url,
              state: buildState({
                rfp: getRfp(req),
                rid: req.ip,
                target_uri: redirect,
              }),
              response_type: 'code',
              scope: scope(req),
            },
          });
          /* eslint-enable camelcase */

          res.redirect(302, destination);
        } else if (req.query.code) {
          req.challenge = req.query.code;
          try {
            verifyState(req.query.state, {
              rfp: getRfp(req),
              ip: req.ip,
              redirect: redirect,
            });
          } catch (e) {
            req.authenticated = false;
            req.authentication = {
              error: 'INVALID_STATE',
              reason: e,
            };
            return request(req, res);
          }
        } else {
          error({
            status: 400,
            error: 'NO_CODE',
            message: req.query.error,
          });
        }
      },
    };
  };
}
