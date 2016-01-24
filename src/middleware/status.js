import isFunction from 'lodash/isFunction';

export default (getStatus) => (app) => {
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
