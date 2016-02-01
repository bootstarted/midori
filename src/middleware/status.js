import isFunction from 'lodash/isFunction';

const statusPresets = {
  continue: 100,
  switchingProtocols: 101,
  ok: 200,
  created: 201,
  accepted: 202,
  nonAuthoritativeInformation: 203,
  noContent: 204,
  resetContent: 205,
  partialContent: 206,
  multipleChoices: 300,
  movedPermanently: 301,
  found: 302,
  seeOther: 303,
  notModified: 304,
  useProxy: 305,
  temporaryRedirect: 307,
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  notAcceptable: 406,
  proxyAuthenticationRequired: 407,
  requestTimeout: 408,
  conflict: 409,
  gone: 410,
  lengthRequired: 411,
  preconditionFailed: 412,
  requestEntityTooLarge: 413,
  requestUriTooLong: 414,
  unsupportedMediaType: 415,
  requestedRangeNotSatisfiable: 416,
  expectationFailed: 417,
  unprocessableEntity: 422,
  tooManyRequests: 429,
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  httpVersionNotSupported: 505,
};

const status = (getStatus) => (app) => {
  const finalGetStatus = isFunction(getStatus) ? getStatus : () => getStatus;
  return {
    ...app,
    request(req, res) {
      return Promise.resolve(req)
        .then(finalGetStatus)
        .then((status) => {
          status && (res.statusCode = status);
          app.request(req, res);
        })
        .catch((err) => app.error(err, req, res));
    },
  };
};

Object.keys(statusPresets).forEach((key) => {
  status[key] = status.bind(null, statusPresets[key]);
});

export default status;
