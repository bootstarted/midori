import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';

const normalize = (url) => {
  if (isFunction(url)) {
    return url;
  } else if (isString(url)) {
    return () => url;
  }
  throw new TypeError();
};

export default function(url) {
  const get = normalize(url);
  return function(app) {
    return {
      ...app,
      request(req, res) {
        res.writeHead(302, {
          Location: get(req, res),
        });
        res.end();
      },
    };
  };
}
