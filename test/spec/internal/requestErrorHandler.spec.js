import {createRequestErrorHandler} from '../../../src/internal/error/requestErrorHandler';
import * as env from '../../../src/internal/environment';

jest.mock('../../../src/internal/environment');

describe('internal/errorHandler/requestErrorHandler', () => {
  let res;
  let fakeConsole;
  let errorHandler;

  beforeEach(() => {
    res = {socket: {}, setHeader: jest.fn(), end: jest.fn()};
    fakeConsole = {error: jest.fn(), log: jest.fn()};
    errorHandler = createRequestErrorHandler(fakeConsole);
  });

  it('should work if the response is finished', () => {
    const err = new Error();
    res.finished = true;
    errorHandler(err, {}, res);
  });

  it('should work with no socket', () => {
    const err = new Error();
    res.socket = false;
    errorHandler(err, {}, res);
  });

  it('should work when headers have already been sent', () => {
    const err = new Error();
    res.headersSent = true;
    errorHandler(err, {}, res);
  });

  it('should assign default statusCode', () => {
    const err = new Error();
    errorHandler(err, {}, res);
    expect(res.statusCode).toEqual(500);
  });

  it('should assign the `statusCode` based on the error', () => {
    const err = new Error();
    err.status = 202;
    errorHandler(err, {}, res);
    expect(res.statusCode).toEqual(202);
  });

  it('should assign the `statusCode` based on the error', () => {
    const err = new Error();
    err.statusCode = 202;
    errorHandler(err, {}, res);
    expect(res.statusCode).toEqual(202);
  });

  describe('production', () => {
    it('should be quiet in production mode', () => {
      const err = new Error();
      env.isProduction.mockImplementation(() => true);
      errorHandler(err, {}, res);
      // TODO: Validate this somehow.
    });
  });
});
