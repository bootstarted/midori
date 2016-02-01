import { expect } from 'chai';
import sinon from 'sinon';

import thunk from '../../../src/middleware/thunk';

describe('thunk', () => {
  it('should use the result of the thunk', () => {
    const next = sinon.spy();
    const stub = sinon.spy((app) => () => {
      return {
        ...app,
        request(req, res) {
          app.request(req, res);
        },
      };
    });
    const app = thunk(stub)({ request: next });
    const req = 1;
    const res = 2;
    app.request(req, res);
    expect(stub).to.be.calledOnce;
  });

  it('should not wrap non-functions', () => {
    const next = sinon.spy();
    const stub = sinon.spy((app) => {
      return () => app;
    });
    const app = thunk(stub)({ request: next, foo: null });
    expect(app).to.have.property('foo', null);
  });
});
