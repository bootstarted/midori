import {expect} from 'chai';
import sinon from 'sinon';

import tap from '../../src/tap';

describe('tap', () => {
  it('should call the tap function', () => {
    const next = sinon.spy();
    const spy = sinon.spy();
    const app = tap(spy)({request: next});
    const req = {};
    const res = {};
    app.request(req, res);
    expect(spy).to.be.calledWith(req, res);
  });

  it('should continue the chain', () => {
    const next = sinon.spy();
    const spy = sinon.spy();
    const app = tap(spy)({request: next});
    const req = {};
    const res = {};
    app.request(req, res);
    expect(next).to.be.calledWith(req, res);
  });
});
