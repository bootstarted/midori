import isFunction from 'lodash/isFunction';

export default (header, getValue) => (app) => {
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

