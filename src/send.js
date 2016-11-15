import isFunction from 'lodash/isFunction';

export default (getBody = (req, res) => res.body) => (app) => {
  const finalGetBody = isFunction(getBody) ? getBody : () => getBody;

  return {
    ...app,
    request(req, res) {
      return Promise.resolve()
        .then(() => finalGetBody(req, res))
        .then((body) => res.end(body))
        .catch((err) => app.error(err, req, res));
    },
  };
};
