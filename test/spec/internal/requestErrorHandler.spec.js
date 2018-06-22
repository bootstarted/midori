import {expect} from 'chai';
import sinon from 'sinon';
import {createRequestErrorHandler} from '../../../src/internal/error/requestErrorHandler';
import * as env from '../../../src/internal/environment';

describe('internal/errorHandler/requestErrorHandler', () => {
  let res;
  let sandbox;
  let fakeConsole;
  let errorHandler;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = {socket: {}, setHeader: sinon.spy(), end: sinon.spy()};
    fakeConsole = {error: sinon.spy(), log: sinon.spy()};
    errorHandler = createRequestErrorHandler(fakeConsole);
  });

  afterEach(() => {
    sandbox.restore();
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
    expect(res.statusCode).to.equal(500);
  });

  it('should assign the `statusCode` based on the error', () => {
    const err = new Error();
    err.status = 202;
    errorHandler(err, {}, res);
    expect(res.statusCode).to.equal(202);
  });

  it('should assign the `statusCode` based on the error', () => {
    const err = new Error();
    err.statusCode = 202;
    errorHandler(err, {}, res);
    expect(res.statusCode).to.equal(202);
  });

  describe('production', () => {
    beforeEach(() => {
      sandbox.stub(env, 'isProduction').returns(true);
    });

    it('should be quiet in production mode', () => {
      const err = new Error();
      errorHandler(err, {}, res);
      // TODO: Validate this somehow.
    });
  });
});
