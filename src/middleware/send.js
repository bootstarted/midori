import isFunction from 'lodash/isFunction';

export default (body = (req) => req.body) => (app) => {
  const getBody = isFunction(body) ? body : () => body;

  return {
    ...app,
    request(req, res) {
      res.end(getBody(req));
    },
  };
};
