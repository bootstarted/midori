import errorHandler from '../../../src/internal/error/upgradeErrorHandler';

describe('internal/errorHandler/upgradeErrorHandler', () => {
  let socket;

  beforeEach(() => {
    socket = {end: jest.fn(), write: jest.fn(), writable: true};
  });

  it('should work', () => {
    const err = new Error();
    // TODO: Make this better.
    errorHandler(err, {}, socket, null);
  });

  it('should work when response is closed', () => {
    const err = new Error();
    // TODO: Make this better.
    socket.writable = false;
    errorHandler(err, {}, socket, null);
  });
});
