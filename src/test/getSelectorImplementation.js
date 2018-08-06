// @flow
import isSelector from '../internal/isSelector';
import type {App} from '../types';

const getSelectorImplementation = (app: App) => {
  if (isSelector(app)) {
    return app._selector;
  }
  throw new TypeError('Must pass valid selector.');
};

export default getSelectorImplementation;
