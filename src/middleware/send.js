import isFunction from 'lodash/isFunction';

export default ({
  body = (req) => req.body,
  type = () => 'text/html; charset=utf-8',
} = {}) => (app) => {
  const getBody = isFunction(body) ? body : () => body;
  const getType = isFunction(type) ? type : () => type;

  return {
    ...app,
    request(req, res) {
      const contentType = getType(req);
      contentType && res.setHeader('Content-Type', getType(req));
      res.end(getBody(req));
    },
  };
};
