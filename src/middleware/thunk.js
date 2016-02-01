/**
 * [default description]
 * @param {Function} thunkCreator Invoked with `app` to create the thunk. Must
 * return a function (the thunk) that returns the actual app. This Function
 * is invoked whenever the app is actually needed (i.e. when any of its event
 * methods are called, like `request`).
 * @returns {Function} Middleware function.
 */
export default (thunkCreator) => (app) => {
  const thunk = thunkCreator(app);
  const thunkApp = {};
  Object.keys(app).forEach(key => {
    if (typeof app[key] === 'function') {
      thunkApp[key] = (...args) => thunk(...args)[key](...args);
    }
  });
  return {
    ...app,
    ...thunkApp,
  };
};
