import errorHandler from '../../../src/internal/error/upgradeErrorHandler';

describe('internal/errorHandler/upgradeErrorHandler', () => {
  let socket;

  beforeEach(() => {
    socket = {end: jest.fn(), write: jest.fn()};
  });

  it('should work', () => {
    const err = new Error();
    // TODO: Make this better.
    errorHandler(err, {}, socket, null);
  });
});
