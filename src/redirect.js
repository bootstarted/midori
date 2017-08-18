import request from './request';
import pure from './pure';
import {format} from 'url';

const normalize2 = (url) => {
  if (typeof url === 'string') {
    return url;
  } else if (typeof url === 'object') {
    return format(url);
  }
  throw new TypeError();
};

const normalize = (statusCode, url) => {
  if (typeof url === 'function') {
    return (req, res) => ({
      statusCode,
      url: normalize2(url(req, res)),
    });
  } else if ((typeof url === 'string') || (typeof url === 'object')) {
    const result = normalize2(url);
    return () => ({
      statusCode,
      url: result,
    });
  }
  throw new TypeError();
};

/**
 * Redirect somewhere. Ends the app chain.
 * @param {?Number} statusCode The status code to send back, defaults to 302.
 * @param {String|Object|Function} url The url to redirect to.
 * @returns {Function} App creator.
 */
export default (...args) => {
  const get = normalize(
    args.length > 1 ? args[0] : 302,
    args.length <= 1 ? args[0] : args[1]
  );
  return request((req, res) => {
    const {url, statusCode} = get(req, res);
    res.writeHead(statusCode, {
      Location: url,
    });
    res.end();
    return pure();
  });
};
