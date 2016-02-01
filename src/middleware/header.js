import isFunction from 'lodash/isFunction';

export const headerPresets = {
  acceptPatch: 'Accept-Patch',
  acceptRanges: 'Accept-Ranges',
  accessControlAllowOrigin: 'Access-Control-Allow-Origin',
  age: 'Age',
  allow: 'Allow',
  cacheControl: 'Cache-Control',
  connection: 'Connection',
  contentDisposition: 'Content-Disposition',
  contentEncoding: 'Content-Encoding',
  contentLanguage: 'Content-Language',
  contentLength: 'Content-Length',
  contentLocation: 'Content-Location',
  contentMd5: 'Content-MD5',
  contentRange: 'Content-Range',
  contentSecurityPolicy: 'Content-Security-Policy',
  contentType: 'Content-Type',
  date: 'Date',
  etag: 'ETag',
  expires: 'Expires',
  lastModified: 'Last-Modified',
  link: 'Link',
  location: 'Location',
  p3p: 'P3P',
  pragma: 'Pragma',
  proxyAuthenticate: 'Proxy-Authenticate',
  publicKeyPins: 'Public-Key-Pins',
  refresh: 'Refresh',
  retryAfter: 'Retry-After',
  server: 'Server',
  setCookie: 'Set-Cookie',
  status: 'Status',
  strictTransportSecurity: 'Strict-Transport-Security',
  trailer: 'Trailer',
  transferEncoding: 'Transfer-Encoding',
  tsv: 'TSV',
  upgrade: 'Upgrade',
  vary: 'Vary',
  via: 'Via',
  warning: 'Warning',
  wwwAuthenticate: 'WWW-Authenticate',
  xContentDuration: 'X-Content-Duration',
  xContentSecurityPolicy: 'X-Content-Security-Policy',
  xContentTypeOptions: 'X-Content-Type-Options',
  xDownloadOptions: 'X-Download-Options',
  xFrameOptions: 'X-Frame-Options',
  xPoweredBy: 'X-Powered-By',
  xUaCompatible: 'X-UA-Compatible',
  xWebkitCsp: 'X-Webkit-CSP',
  xXssProtection: 'X-XSS-Protection',
};

const header = (header, getValue) => (app) => {
  const finalGetValue = isFunction(getValue) ? getValue : () => getValue;
  return {
    ...app,
    request(req, res) {
      return Promise.resolve(req)
        .then(finalGetValue)
        .then((value) => {
          value && res.setHeader(header, value);
          app.request(req, res);
        })
        .catch((err) => app.error(err, req, res));
    },
  };
};

Object.keys(headerPresets).forEach((key) => {
  header[key] = header.bind(null, headerPresets[key]);
});

export default header;
