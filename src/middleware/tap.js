export default (tap) => (app) => {
  return {
    ...app,
    request(req, res) {
      tap(req, res, app.error);
      app.request(req, res);
    },
  };
};
