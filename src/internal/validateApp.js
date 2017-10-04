const validateApp = (app) => {
  if (typeof app.request !== 'function') {
    throw new TypeError('Must provide a valid request handler.');
  }
  if (typeof app.error !== 'function') {
    throw new TypeError('Must provider a valid error handler.');
  }
};

export default validateApp;
