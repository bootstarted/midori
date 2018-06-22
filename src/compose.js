// @flow

/**
 * Composes apps together from left to right.
 *
 * @param {Array<App>} apps The apps to compose.
 * @returns {App} A new app representing the sequential combination of all the
 * given apps.
 */
const compose = (...apps: Array<*>): * => {
  if (apps.length === 0) {
    return (arg) => arg;
  }

  if (apps.length === 1) {
    return apps[0];
  }

  return apps.reduce((a, b) => (...args) => a(b(...args)));
};

/**
 * @tag core
 * @desc Combine apps.
 */
// TODO: FIXME: Any way to do this without casting through `any`?
// $ExpectError
export default ((compose: any): $Compose);
