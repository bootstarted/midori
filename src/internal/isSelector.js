// @flow
const isSelector = (app: mixed): boolean => {
  return typeof app === 'function' && typeof app._selector === 'function';
};

export default isSelector;
