import sinon from 'sinon';
import errorHandler from '../../../src/internal/error/upgradeErrorHandler';

describe('internal/errorHandler/upgradeErrorHandler', () => {
  let socket;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    socket = {end: sinon.spy(), write: sinon.spy()};
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should work', () => {
    const err = new Error();
    // TODO: Make this better.
    errorHandler(err, {}, socket, null);
  });
});
