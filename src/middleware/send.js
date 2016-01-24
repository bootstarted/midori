import isFunction from 'lodash/isFunction';

export default (getBody = (req) => req.body) => (app) => {
  const finalGetBody = isFunction(getBody) ? getBody : () => getBody;

  return {
    ...app,
    request(req, res) {
      return Promise.resolve(req)
        .then(finalGetBody)
        .then((body) => res.end(body))
        .catch((err) => app.error(err, req, res));
    },
  };
};
